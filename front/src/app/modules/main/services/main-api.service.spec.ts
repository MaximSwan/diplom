/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MainApiService } from './main-api.service';

describe('Service: MainApi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainApiService]
    });
  });

  it('should ...', inject([MainApiService], (service: MainApiService) => {
    expect(service).toBeTruthy();
  }));
});
