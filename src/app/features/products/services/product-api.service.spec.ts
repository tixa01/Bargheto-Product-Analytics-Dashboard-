import { TestBed } from '@angular/core/testing';

import { ProductApiService } from './product-api.service';

describe('ProductApi', () => {
  let service: ProductApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
