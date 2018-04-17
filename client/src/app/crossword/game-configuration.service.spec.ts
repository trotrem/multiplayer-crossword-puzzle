import { TestBed, inject } from '@angular/core/testing';

import { GameConfigurationService } from './game-configuration.service';

describe('GameConfigurationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameConfigurationService]
    });
  });

  it('should be created', inject([GameConfigurationService], (service: GameConfigurationService) => {
    expect(service).toBeTruthy();
  }));
});
