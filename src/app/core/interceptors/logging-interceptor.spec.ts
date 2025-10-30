import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { LoggingInterceptor } from './logging-interceptor';

describe('LoggingInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let consoleLogSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LoggingInterceptor, 
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoggingInterceptor, 
          multi: true,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);

    consoleLogSpy = spyOn(console, 'log').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should log request and response', (done) => {
    const testUrl = '/api/test';
    const mockResponse = { data: 'test data' };


    httpClient.get(testUrl).subscribe(response => {
   
      expect(response).toEqual(mockResponse);

      expect(consoleLogSpy).toHaveBeenCalledWith(`[Request] GET ${testUrl}`);
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        jasmine.stringMatching(/\[Response\] 200 \/api\/test - \d+ms/)
      );

      done();
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });
});