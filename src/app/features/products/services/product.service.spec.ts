import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { ProductApiService } from './product-api.service';
import { Product, ProductApiResponse } from '../../models/product.model';
import { Category } from '../models/mcategory.model';


const MOCK_PRODUCTS: Product[] = [
  { 
    id: 1, 
    title: 'iPhone 9', 
    category: 'smartphones', 
    price: 549, 
    thumbnail: 'thumbnail.jpg', 
    description: 'An Apple mobile which is nothing like Apple', 
    discountPercentage: 12.96, 
    rating: 4.69, 
    stock: 94, 
    brand: 'Apple', 
    images: [] 
  },
  { 
    id: 2, 
    title: 'iPhone X', 
    category: 'smartphones', 
    price: 899, 
    thumbnail: 'thumbnail2.jpg', 
    description: 'SIM-Free, Model A19211 6.5-inch Super Retina HD display', 
    discountPercentage: 17.94, 
    rating: 4.44, 
    stock: 34, 
    brand: 'Apple', 
    images: [] 
  }
];

const MOCK_API_RESPONSE: ProductApiResponse = {
  products: MOCK_PRODUCTS,
  total: 2,
  skip: 0,
  limit: 2
};

const MOCK_CATEGORIES: Category[] = [
  { slug: 'smartphones', name: 'Smartphones' },
  { slug: 'laptops', name: 'Laptops' }
];

describe('ProductService', () => {
  let service: ProductService;
  let apiService: ProductApiService;
  let httpTestingController: HttpTestingController;
  const apiUrl = 'https://dummyjson.com/products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule 
      ],
      providers: [
        ProductService,
        ProductApiService
      ]
    });

    service = TestBed.inject(ProductService);
    apiService = TestBed.inject(ProductApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    
    const req = httpTestingController.expectOne(`${apiUrl}/categories`);
    req.flush(MOCK_CATEGORIES);
  });

  it('should load categories on initialization', () => {
    const req = httpTestingController.expectOne(`${apiUrl}/categories`);
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_CATEGORIES);
    expect(service.categories()).toEqual(MOCK_CATEGORIES);
  });

  it('should fetch all products when filters are default', () => {
    const catReq = httpTestingController.expectOne(`${apiUrl}/categories`);
    catReq.flush(MOCK_CATEGORIES);

    const productReq = httpTestingController.expectOne(`${apiUrl}?limit=30&skip=0`);
    expect(productReq.request.method).toBe('GET');
    productReq.flush(MOCK_API_RESPONSE);

    expect(service.products()).toEqual(MOCK_PRODUCTS);
    expect(service.total()).toBe(2);
    expect(service.loading()).toBe(false);
    expect(service.error()).toBe(null);
  });

  it('should call category endpoint when category filter is set', () => {
    httpTestingController.expectOne(`${apiUrl}/categories`).flush(MOCK_CATEGORIES);
    httpTestingController.expectOne(`${apiUrl}?limit=30&skip=0`).flush(MOCK_API_RESPONSE);
    
    service.setCategory('laptops');

    const req = httpTestingController.expectOne(`${apiUrl}/category/laptops`);
    expect(req.request.method).toBe('GET');
    
    const laptopResponse: ProductApiResponse = { 
      products: [{ id: 3, title: 'MacBook Pro', category: 'laptops', price: 1749, thumbnail: '', description: '', discountPercentage: 0, rating: 0, stock: 0, brand: '', images: [] }],
      total: 1, skip: 0, limit: 1 
    };
    req.flush(laptopResponse);

    expect(service.products()[0].title).toBe('MacBook Pro');
    expect(service.total()).toBe(1);
  });

  it('should call search endpoint when search query is set', () => {
    httpTestingController.expectOne(`${apiUrl}/categories`).flush(MOCK_CATEGORIES);
    httpTestingController.expectOne(`${apiUrl}?limit=30&skip=0`).flush(MOCK_API_RESPONSE);
-
    service.setSearchQuery('iPhone');
    const req = httpTestingController.expectOne(`${apiUrl}/search?limit=30&skip=0&q=iPhone`);
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_API_RESPONSE); // Reuse mock response

    expect(service.products()).toEqual(MOCK_PRODUCTS);
  });
  
  it('should set error state if product fetch fails', () => {
    httpTestingController.expectOne(`${apiUrl}/categories`).flush(MOCK_CATEGORIES);


    const productReq = httpTestingController.expectOne(`${apiUrl}?limit=30&skip=0`);
    productReq.flush('Network error', { status: 500, statusText: 'Server Error' });
    

    expect(service.error()).toBe('Failed to fetch products');
    expect(service.loading()).toBe(false);
    expect(service.products()).toEqual([]);
  });

  it('should fetch a single product by ID using getProductById', (done) => {
    httpTestingController.expectOne(`${apiUrl}/categories`).flush(MOCK_CATEGORIES);
    httpTestingController.expectOne(`${apiUrl}?limit=30&skip=0`).flush(MOCK_API_RESPONSE);

    const testProduct = MOCK_PRODUCTS[0];

    service.getProductById(1).subscribe(product => {
      expect(product).toEqual(testProduct);
      done(); 
    });

    const req = httpTestingController.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(testProduct);
  });

});
