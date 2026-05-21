import { Component, effect, HostListener, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArtistPageService } from '../service/artist-page.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistPage } from '../service/artist-page.model';
import { finalize } from 'rxjs';
import { MessageService } from '../../shared/message/message.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { Category } from '../../categories/category.model';
import { CategoryService } from '../../categories/category.service';
import { MatInput } from '@angular/material/input';
import { PersonNameDirective } from '../../shared/directives/person-name.directive';
import { QuillEditorComponent } from 'ngx-quill';
import { MatAnchor } from '@angular/material/button';
import { ConfirmDialogService } from '../../shared/dialogs/confirm-dialog.service';
import { UpdateArtistPageRequest } from '../service/update-artist-page-request.model';

@Component({
  selector: 'app-edit-artist-page',
  imports: [
    ReactiveFormsModule,
    MatProgressSpinner,
    MatFormField,
    MatLabel,
    MatHint,
    MatOption,
    MatInput,
    PersonNameDirective,
    QuillEditorComponent,
    MatAnchor,
    MatSelect,
  ],
  templateUrl: './edit-artist-page.component.html',
  styleUrl: './edit-artist-page.component.scss',
})
export class EditArtistPageComponent implements OnInit {
  private readonly artistService = inject(ArtistPageService);
  private readonly route = inject(ActivatedRoute);
  private readonly messageService = inject(MessageService);
  private readonly categoryService = inject(CategoryService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly router = inject(Router);

  private readonly _artist = signal<ArtistPage | null>(null);
  private readonly _categories = signal<Category[]>([]);

  readonly loading = signal(true);
  readonly categoriesLoading = signal(true);

  readonly editArtistPageForm = new FormGroup({
    name: new FormControl('', Validators.required),
    categorySlug: new FormControl('', Validators.required),
    bodyHtml: new FormControl(''),
  });

  readonly sentReq = signal(false);

  constructor() {
    effect(() => {
      const artistData = this._artist();

      this.editArtistPageForm.patchValue({
        name: artistData?.name,
        categorySlug: artistData?.categorySlug,
        bodyHtml: artistData?.bodyHtml,
      });
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (!this.canExit()) {
      event.preventDefault();
    }
  }

  ngOnInit(): void {
    this.listenForRouteParams();
  }

  get currentData(): ArtistPage | null {
    return this._artist();
  }

  get categories(): Category[] {
    return this._categories();
  }

  canExit(): boolean {
    return !this.editArtistPageForm.dirty;
  }

  disableSaveButton(): boolean {
    return !this.editArtistPageForm.dirty || this.sentReq() || !this.editArtistPageForm.valid;
  }

  saveChanges() {
    if (this.editArtistPageForm.valid) {
      const artistName = this._artist()!.name;

      this.confirmDialog
        .confirm(`Save changes to ${artistName}'s artist page?`)
        .subscribe((confirmed) => {
          if (confirmed) {
            const pageId = this._artist()!.id;
            const req = this.extractFormData();

            this.sentReq.set(true);

            this.artistService
              .updateArtistPage(pageId, req)
              .pipe(finalize(() => this.sentReq.set(false)))
              .subscribe({
                next: (updated) => {
                  this.editArtistPageForm.markAsPristine();
                  this.messageService.success('Artist page updated.');
                  this.router.navigate(['/artists', updated.slug]);
                },
              });
          }
        });
    }
  }

  private extractFormData(): UpdateArtistPageRequest {
    const req: UpdateArtistPageRequest = {};

    const current = this._artist()!;

    const formName = this.editArtistPageForm.get('name')!.value!;
    if (current.name !== formName) {
      req.name = formName;
    }

    const formCategorySlug = this.editArtistPageForm.get('categorySlug')!.value!;
    if (current.categorySlug !== formCategorySlug) {
      req.categorySlug = formCategorySlug;
    }

    const formHtml = this.editArtistPageForm.get('bodyHtml')!.value!;
    if (current.bodyHtml !== formHtml) {
      req.bodyHtml = formHtml;
    }

    return req;
  }

  private listenForRouteParams() {
    this.route.paramMap.subscribe((params) => {
      const artistSlug = params.get('artistSlug');

      if (!artistSlug) return;

      this.loadCategories();
      this.loadArtistFromSlug(artistSlug);
    });
  }

  private loadArtistFromSlug(slug: string) {
    this.artistService
      .getArtistPageBySlug(slug)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (artist) => this._artist.set(artist),
        error: () => this.messageService.error('Could not load artist'),
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
}
