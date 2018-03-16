import { TestBed, inject } from '@angular/core/testing';

import { GridModeService } from './grid-mode.service';

describe('GridModeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridModeService]
    });
  });

  it('should be created', inject([GridModeService], (service: GridModeService) => {
    expect(service).toBeTruthy();
  }));
});
