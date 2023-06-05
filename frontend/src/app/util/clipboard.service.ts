import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'any',
})
export class ClipboardService {
  async copy(text: string): Promise<boolean> {
    if (!navigator.clipboard) return false;
    try {
      const result = await navigator.clipboard.writeText(text);
      return result === undefined;
    } catch (err) {
      return false;
    }
  }
}
