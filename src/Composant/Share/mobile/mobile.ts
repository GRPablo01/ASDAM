import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  Renderer2
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { ThemeService } from '../../../../Backend/Services/theme.service';
import { Theme } from '../Page-Header/theme/theme';

@Component({
  selector: 'app-mobile',
  standalone: true,
  imports: [CommonModule, Theme],
  templateUrl: './mobile.html',
  styleUrls: ['./mobile.css'],
})
export class Mobile implements OnInit, OnDestroy {

  isMobile: boolean = false;
  currentWidth: number = window.innerWidth;

  constructor(
    public themeService: ThemeService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.checkScreen();
  }

  ngOnDestroy(): void {
    this.enableScroll();
  }

  // =====================================================
  // RESIZE
  // =====================================================

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreen();
  }

  // =====================================================
  // MOBILE CHECK
  // =====================================================

  checkScreen(): void {

    this.currentWidth = window.innerWidth;

    this.isMobile = this.currentWidth < 382;

    // 🔒 bloque le scroll uniquement si la page mobile s'affiche
    if (this.isMobile) {
      this.disableScroll();
    } else {
      this.enableScroll();
    }
  }

  // =====================================================
  // DISABLE SCROLL
  // =====================================================

  disableScroll(): void {

    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.renderer.setStyle(document.body, 'touch-action', 'none');

    this.renderer.setStyle(document.documentElement, 'overflow', 'hidden');
    this.renderer.setStyle(document.documentElement, 'touch-action', 'none');
  }

  // =====================================================
  // ENABLE SCROLL
  // =====================================================

  enableScroll(): void {

    this.renderer.removeStyle(document.body, 'overflow');
    this.renderer.removeStyle(document.body, 'touch-action');

    this.renderer.removeStyle(document.documentElement, 'overflow');
    this.renderer.removeStyle(document.documentElement, 'touch-action');
  }

}