import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService, Theme } from '../../../core/services/settings';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.html',
  styleUrls: ['./theme-toggle.scss'],
  standalone: false
})
export class ThemeToggle implements OnInit {
  
  public theme$!: Observable<Theme>;

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.theme$ = this.settingsService.getTheme();
  }

  public toggleTheme(): void {
    this.settingsService.toggleTheme();
  }
}
