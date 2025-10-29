import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class ProductListComponent implements OnInit, OnDestroy {

  private productService = inject(ProductService);

  products = this.productService.products;
  categories = this.productService.categories;
  loading = this.productService.loading;
  error = this.productService.error;

  filterForm: FormGroup;
  private destroy$ = new Subject<void>();

  constructor() {
    this.filterForm = new FormGroup({
      search: new FormControl(this.productService.query()),
      category: new FormControl(this.productService.category()), 
    });
  }

  ngOnInit(): void {
    this.listenToFilters();
  }

  private listenToFilters(): void {
    
    this.filterForm.get('search')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(query => this.productService.setSearchQuery(query)), 
      takeUntil(this.destroy$)
    ).subscribe();

    this.filterForm.get('category')?.valueChanges.pipe(
      distinctUntilChanged(),
      tap(category => this.productService.setCategory(category)), 
      takeUntil(this.destroy$)
    ).subscribe();
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}