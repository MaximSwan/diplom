/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MainArtsService } from './main-arts.service';

describe('Service: MainArts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainArtsService]
    });
  });

  it('should ...', inject([MainArtsService], (service: MainArtsService) => {
    expect(service).toBeTruthy();
  }));
});
