import { TestBed } from '@angular/core/testing';

import { OpenDndService } from './open-dnd-service';

describe('OpenDndService', () => {
  let service: OpenDndService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenDndService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
