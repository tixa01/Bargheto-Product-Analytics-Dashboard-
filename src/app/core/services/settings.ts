import { Injectable, RendererFactory2, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private renderer: Renderer2;
  private readonly storageKey = 'app-theme';
  
  private currentTheme$: BehaviorSubject<Theme>;

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    
    const savedTheme = localStorage.getItem(this.storageKey) as Theme | null;
    const initialTheme: Theme = savedTheme || 'light';
    
    this.currentTheme$ = new BehaviorSubject<Theme>(initialTheme);
    this.applyTheme(initialTheme);
  }

  public getTheme(): Observable<Theme> {
    return this.currentTheme$.asObservable();
  }

  public toggleTheme(): void {
    const newTheme: Theme = this.currentTheme$.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  public setTheme(theme: Theme): void {
    this.currentTheme$.next(theme);
    localStorage.setItem(this.storageKey, theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    if (theme === 'dark') {
      this.renderer.addClass(this.document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(this.document.body, 'dark-theme');
    }
  }
}
