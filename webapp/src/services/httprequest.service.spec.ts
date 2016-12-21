/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HttprequestService } from './httprequest.service';

describe('HttprequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttprequestService]
    });
  });

  it('should ...', inject([HttprequestService], (service: HttprequestService) => {
    expect(service).toBeTruthy();
  }));
});
