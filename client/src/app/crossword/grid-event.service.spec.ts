import { TestBed, inject } from '@angular/core/testing';

import { GridEventService } from './grid-event.service';

describe('GridEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridEventService]
    });
  });

  it('should be created', inject([GridEventService], (service: GridEventService) => {
    expect(service).toBeTruthy();
  }));
});
