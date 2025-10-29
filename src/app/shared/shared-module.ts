import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbar } from "@angular/material/toolbar";
import { ThemeToggle } from './components/theme-toggle/theme-toggle';


const MATERIAL_MODULES = [
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatSelectModule,
  MatToolbar
];


@NgModule({
  declarations: [
    ThemeToggle
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    
    ...MATERIAL_MODULES
  ],
  exports: [
    CommonModule,
    ThemeToggle,
    ReactiveFormsModule,
    ...MATERIAL_MODULES
  ]
})
export class SharedModule { }
