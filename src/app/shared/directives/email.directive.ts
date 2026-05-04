import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appEmail]',
})
export class EmailDirective {
  private readonly pattern = /[^a-zA-Z0-9._%+\-@]/g;

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(this.pattern, '');
  }
}
