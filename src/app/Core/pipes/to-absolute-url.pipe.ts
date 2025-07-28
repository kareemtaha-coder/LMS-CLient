import { inject, Pipe, PipeTransform } from '@angular/core';
import { BASE_URL } from '../api/base-url.token';

@Pipe({
  name: 'toAbsoluteUrl',
  standalone: true,
})
export class ToAbsoluteUrlPipe implements PipeTransform {
  private baseUrl = inject(BASE_URL);

  transform(value: string | undefined | null): string | null {
    // If the value is empty or already an absolute URL, return it as is.
    if (!value || value.startsWith('http')) {
      return value ?? null;
    }
    // Otherwise, prepend the base URL.
    return `${this.baseUrl}${value}`;
  }
}
