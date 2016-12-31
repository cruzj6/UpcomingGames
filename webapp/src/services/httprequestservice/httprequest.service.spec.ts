/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HttpRequestService } from './httprequest.service';

describe('HttpRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttprequestService]
    });
  });

  it('should ...', inject([HttprequestService], (service: HttprequestService) => {
    expect(service).toBeTruthy();
  }));
});
