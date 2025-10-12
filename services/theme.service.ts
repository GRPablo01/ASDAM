import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _currentTheme: 'light' | 'dark' = 'light';
  get currentTheme() {
    return this._currentTheme;
  }

  toggleTheme() {
    this._currentTheme = this._currentTheme === 'light' ? 'dark' : 'light';
    const html = document.documentElement;
    if (this._currentTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }
}
