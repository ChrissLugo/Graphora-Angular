import { TestBed } from '@angular/core/testing';

import { DiagramMakerService } from './diagram-maker.service';

describe('DiagramMakerService', () => {
  let service: DiagramMakerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiagramMakerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
