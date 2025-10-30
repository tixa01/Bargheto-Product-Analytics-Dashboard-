import { ChangeDetectionStrategy, Component, OnInit, inject, DestroyRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
// Import the new operator
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class ProductListComponent implements OnInit {
  
  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);

  products = this.productService.products;
  categories = this.productService.categories;
  loading = this.productService.loading;
  error = this.productService.error;

  filterForm: FormGroup;

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
      takeUntilDestroyed(this.destroyRef) // <-- MODERN FIX
    ).subscribe();

    this.filterForm.get('category')?.valueChanges.pipe(
      distinctUntilChanged(),
      tap(category => this.productService.setCategory(category)),
      takeUntilDestroyed(this.destroyRef) // <-- MODERN FIX
    ).subscribe();
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

}