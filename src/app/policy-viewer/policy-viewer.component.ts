import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-policy-viewer',
  imports: [],
  template: `<div class="policy-container" [innerHTML]="htmlContent()"></div>`,
  styleUrl: './policy-viewer.component.scss',
})
export class PolicyViewerComponent {
  readonly htmlContent = signal<string>('');

  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    const file = this.route.snapshot.data['file'];

    this.load(file);
  }

  private load(path: string) {
    this.http
      .get(path, { responseType: 'text' })
      .subscribe((content) => this.htmlContent.set(content));
  }
}
