import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArtistPageService } from '../../artist-page/service/artist-page.service';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { PersonNameDirective } from '../../shared/directives/person-name.directive';
import { MatSelect, MatOption } from '@angular/material/select';
import { CategoryService } from '../../categories/category.service';
import { Category } from '../../categories/category.model';
import { finalize } from 'rxjs';
import { ConfirmDialogService } from '../../shared/dialogs/confirm-dialog.service';
import { CreateArtistPageRequest } from '../../artist-page/service/create-artist-page-request.model';
import { MessageService } from '../../shared/message/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatAnchor } from '@angular/material/button';
import { QuillEditorComponent } from 'ngx-quill';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-artist-page',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    PersonNameDirective,
    MatSelect,
    MatOption,
    MatAnchor,
    QuillEditorComponent,
    MatHint,
  ],
  templateUrl: './add-artist-page.component.html',
  styleUrl: './add-artist-page.component.scss',
})
export class AddArtistPageComponent implements OnInit {
  private readonly artistService = inject(ArtistPageService);
  private readonly categoryService = inject(CategoryService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  readonly createArtistForm = new FormGroup({
    name: new FormControl('', Validators.required),
    bodyHtml: new FormControl(''),
    categorySlug: new FormControl('', Validators.required),
  });

  private readonly _categories = signal<Category[]>([]);
  readonly categoriesLoading = signal(true);
  readonly reqSubmitted = signal(false);

  ngOnInit(): void {
    this.loadCategories();
  }

  canExit(): boolean {
    return !this.createArtistForm.dirty && !this.reqSubmitted();
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (!this.canExit()) {
      event.preventDefault();
    }
  }

  get categories(): Category[] {
    return this._categories();
  }

  saveButtonDisabled(): boolean {
    return !this.createArtistForm.valid || this.reqSubmitted();
  }

  createArtistPage() {
    this.confirmDialog.confirm('Create artist page?').subscribe((confirmed) => {
      if (confirmed) {
        const req = this.extractFormData();

        this.reqSubmitted.set(true);

        this.artistService
          .createArtistPage(req)
          .pipe(finalize(() => this.reqSubmitted.set(false)))
          .subscribe({
            next: (artistPage) => {
              this.messageService.success('Artist page created.');
              this.createArtistForm.reset();

              this.router.navigate(['/artists', artistPage.slug]);
            },
            error: (err: HttpErrorResponse) => this.messageService.error(err.message),
          });
      }
    });
  }

  private loadCategories() {
    this.categoryService
      .getAllCategories()
      .pipe(finalize(() => this.categoriesLoading.set(false)))
      .subscribe({
        next: (categories) => this._categories.set(categories),
      });
  }

  /** Extracts form values into a creation request. */
  private extractFormData(): CreateArtistPageRequest {
    const name = this.createArtistForm.get('name')!.value!;
    const slug = this.toSlug(name);

    const req: CreateArtistPageRequest = {
      name: name,
      slug: slug,
      bodyHtml: this.createArtistForm.get('bodyHtml')!.value!,
      categorySlug: this.createArtistForm.get('categorySlug')!.value!,
    };

    return req;
  }

  private toSlug(str: string): string {
    return str
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll(/[^a-z0-9-]+/g, '');
  }
}
