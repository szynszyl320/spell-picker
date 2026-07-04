import { TestBed } from '@angular/core/testing';

import { LocalSave } from './local-save';

describe('LocalSave', () => {
  let service: LocalSave;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalSave);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
