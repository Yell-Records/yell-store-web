import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatAnchor } from '@angular/material/button';
import { AdminCategoryDisplayComponent } from './admin-category-display/admin-category-display.component';
import { TitleDirective } from '../../shared/directives/title.directive';
import { CategoryService } from '../../categories/category.service';
import { MessageService } from '../../shared/message/message.service';
import { ConfirmDialogService } from '../../shared/dialogs/confirm-dialog.service';
import { Category } from '../../categories/category.model';
import { CreateCategoryRequest } from '../../categories/create-category-request.model';
import { UserStore } from '../../core/stores/user.store';

@Component({
  selector: 'app-category-management',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    TitleDirective,
    MatAnchor,
    AdminCategoryDisplayComponent,
  ],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss',
})
export class CategoryManagementComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly messageService = inject(MessageService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly userStore = inject(UserStore);

  readonly categoryNameControl = new FormControl('', Validators.required);

  private readonly _categories = signal<Category[]>([]);

  ngOnInit(): void {
    this.loadCategories();
  }

  get categories(): Category[] {
    return this._categories();
  }

  submitCreateForm() {
    if (this.categoryNameControl.valid && this.userStore.isLoggedIn()) {
      this.confirmDialog
        .confirm('Create new category? This action is permanent.')
        .subscribe((confirmed) => {
          if (confirmed) {
            const name = this.categoryNameControl.value!;
            const req: CreateCategoryRequest = {
              name: name,
              slug: this.toSlug(name),
            };

            this.categoryService.createCategory(req).subscribe({
              next: (category) => {
                this.categoryNameControl.reset();
                this.messageService.success('Category created.');

                // Update the signal
                this._categories.update((list) => [...list, category]);
              },
              error: () => this.messageService.error('Could not create category.'),
            });
          }
        });
    }
  }

  /**
   * Converts a string to a valid slug.
   *
   * @param str String to convert
   * @returns
   */
  private toSlug(str: string): string {
    return str
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll(/[^a-z0-9-]+/g, '');
  }

  private loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => this._categories.set(categories),
      error: () => this.messageService.error('Could not load categories.'),
    });
  }
}
