import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

/**
 * by Nicolai Haferkamp
 *
 * Based on: https://www.youtube.com/watch?v=5VOuUdDXRsE
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  currentTheme!: string;
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.currentTheme = 'lara-dark-blue';
  }

  switchTheme(theme: string) {
    const themeLink = this.document.getElementById(
      'app-theme'
    ) as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = theme + '.css';
    }
    this.currentTheme = theme;
  }

  getCurrentTheme(): string {
    return this.currentTheme;
  }
}
