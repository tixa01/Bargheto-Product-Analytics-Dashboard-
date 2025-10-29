import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductApiResponse } from '../../models/product.model';
import { Category } from '../models/mcategory,model';

@Injectable({
  providedIn: 'root' 
})
export class ProductApiService {
  private readonly apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  /**
   * Fetches a paginated, searchable list of products.
   * @param limit - Number of products to return
   * @param skip - Number of products to skip
   * @param query - Optional search query
   */
  getProducts(limit: number = 10, skip: number = 0, query: string = ''): Observable<ProductApiResponse> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('skip', skip.toString());

    let url = this.apiUrl;

    if (query) {
      url = `${this.apiUrl}/search`; // Use the search endpoint
      params = params.set('q', query);
    }

    return this.http.get<ProductApiResponse>(url, { params });
  }

  /**
   * Fetches a single product by its ID.
   * @param id - The ID of the product
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /**
   * Fetches all available product categories.
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  /**
   * Fetches products for a specific category.
   * @param category - The category name
   */
  getProductsByCategory(category: string): Observable<ProductApiResponse> {
    return this.http.get<ProductApiResponse>(`${this.apiUrl}/category/${category}`);
  }
}
