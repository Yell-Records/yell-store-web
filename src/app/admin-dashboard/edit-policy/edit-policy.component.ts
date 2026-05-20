import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PolicyService } from '../../policy-viewer/policy.service';
import { QuillModule } from 'ngx-quill';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from '../../shared/message/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatAnchor } from '@angular/material/button';
import { ConfirmDialogService } from '../../shared/dialogs/confirm-dialog.service';

@Component({
  selector: 'app-edit-policy',
  imports: [QuillModule, ReactiveFormsModule, MatAnchor],
  templateUrl: './edit-policy.component.html',
  styleUrl: './edit-policy.component.scss',
})
export class EditPolicyComponent implements OnInit {
  readonly editorControl = new FormControl('');

  private readonly route = inject(ActivatedRoute);
  private readonly policyService = inject(PolicyService);
  private readonly messageService = inject(MessageService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  readonly name = signal('');

  ngOnInit(): void {
    this.listenForRouteParams();
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (!this.canExit()) {
      event.preventDefault();
    }
  }

  canExit(): boolean {
    return !this.editorControl.dirty;
  }

  private load(name: string) {
    this.policyService.getPolicy(name).subscribe((content) => {
      this.editorControl.setValue(content);
      this.editorControl.markAsPristine();
    });
  }

  save() {
    const content = this.editorControl.value!;

    this.confirmDialog.confirm(`Save changes to ${this.name()}?`).subscribe((confirmed) => {
      if (confirmed) {
        this.policyService.savePolicy(this.name(), content).subscribe({
          next: () => {
            this.messageService.success('Policy updated.');
            this.editorControl.markAsPristine();
          },
          error: (err: HttpErrorResponse) => this.messageService.error(err.message),
        });
      }
    });
  }

  private listenForRouteParams() {
    this.route.paramMap.subscribe((params) => {
      const filename = params.get('name');

      if (filename) {
        this.name.set(filename);
        this.load(filename);
      }
    });
  }
}
