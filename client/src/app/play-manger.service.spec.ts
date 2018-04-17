import { TestBed, inject } from '@angular/core/testing';

import { PlayMangerService } from './play-manger.service';

describe('PlayMangerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayMangerService]
    });
  });

  it('should be created', inject([PlayMangerService], (service: PlayMangerService) => {
    expect(service).toBeTruthy();
  }));
});
