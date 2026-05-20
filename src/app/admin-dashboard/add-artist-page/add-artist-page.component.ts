import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArtistPageService } from '../../artist-page/service/artist-page.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
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
  ],
  templateUrl: './add-artist-page.component.html',
  styleUrl: './add-artist-page.component.scss',
})
export class AddArtistPageComponent implements OnInit {
  private readonly artistService = inject(ArtistPageService);
  private readonly categoryService = inject(CategoryService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly messageService = inject(MessageService);

  readonly createArtistForm = new FormGroup({
    name: new FormControl('', Validators.required),
    slug: new FormControl('', Validators.required),
    bodyHtml: new FormControl(''),
    youtubeUrls: new FormControl<string[]>([]),
    categorySlug: new FormControl('', Validators.required),
  });

  private readonly _categories = signal<Category[]>([]);
  readonly categoriesLoading = signal(true);
  readonly reqSubmitted = signal(false);

  ngOnInit(): void {
    this.loadCategories();
  }

  // TODO Create a route deactivate guard after changes are merged in from other branch
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

              // TODO Navigate to artist page
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
    const req: CreateArtistPageRequest = {
      name: this.createArtistForm.get('name')!.value!,
      slug: this.createArtistForm.get('slug')!.value!,
      bodyHtml: this.createArtistForm.get('bodyHtml')!.value!,
      youtubeUrls: this.createArtistForm.get('youtubeUrls')!.value!,
      categorySlug: this.createArtistForm.get('categorySlug')!.value!,
    };

    return req;
  }
}
