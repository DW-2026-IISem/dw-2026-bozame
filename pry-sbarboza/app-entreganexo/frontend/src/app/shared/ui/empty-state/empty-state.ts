import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center p-8 text-center text-slate-500">
      <i [class]="icon()" class="mb-3 text-4xl text-slate-400"></i>
      <h3 class="text-lg font-medium text-slate-700">{{ title() }}</h3>
      @if (message()) {
        <p class="mt-1 text-sm text-slate-500">{{ message() }}</p>
      }
    </div>
  `,
})
export class EmptyState {
  readonly icon = input.required<string>();
  readonly title = input.required<string>();
  readonly message = input<string>();
}
