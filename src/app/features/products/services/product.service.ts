import { Injectable, computed, effect, signal, Injector } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop'; // Import this!
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ProductApiService } from './product-api.service';
import { Product } from '../../models/product.model';
import { Category } from '../models/mcategory,model';

export interface ProductState {
  products: Product[];
  total: number;
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export interface ProductFilters {
  query: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private state = signal<ProductState>({
    products: [],
    total: 0,
    categories: [],
    loading: true, 
    error: null,
  });
  public categories = computed(() => this.state().categories);
  public products = computed(() => this.state().products);
  public total = computed(() => this.state().total);
  public loading = computed(() => this.state().loading);
  public error = computed(() => this.state().error);

  private filters = signal<ProductFilters>({
    query: '',
    category: 'all',
  });
  public query = computed(() => this.filters().query);
  public category = computed(() => this.filters().category);

  constructor(
    private api: ProductApiService, 
    private injector: Injector 
  ) {
    const filters$ = toObservable(this.filters, { injector: this.injector });

    filters$.pipe(
      tap(() => this.state.update(s => ({ ...s, loading: true }))),
      switchMap(filters => {
        if (filters.category !== 'all') {
          return this.api.getProductsByCategory(filters.category);
        }
        return this.api.getProducts(30, 0, filters.query);
      }),
      catchError(err => {
        console.error(err);
        this.state.update(s => ({ ...s, loading: false, error: 'Failed to fetch products' }));
        return of(null);
      })
    ).subscribe(response => {
      if (response) {
        this.state.update(s => ({
          ...s,
          products: response.products,
          total: response.total,
          loading: false,
          error: null,
        }));
      }
    });

    this.loadCategories();
  }


  public loadCategories(): void {
    this.api.getCategories().pipe(
      catchError(err => (console.error(err), of([])))
    ).subscribe(categories => {
      this.state.update(s => ({ ...s, categories: categories }));
    });
  }

  public getProductById(id: number): Observable<Product> {
    return this.api.getProductById(id).pipe(
      catchError(err => {
        console.error(err);
        throw new Error('Failed to fetch product details');
      })
    );
  }

  public setSearchQuery(query: string): void {
    this.filters.update(f => ({ ...f, query }));
  }

  public setCategory(category: string): void {
    this.filters.update(f => ({ ...f, category }));
  }
  
}