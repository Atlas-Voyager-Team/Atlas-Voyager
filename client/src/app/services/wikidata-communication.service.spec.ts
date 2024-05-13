import { TestBed } from '@angular/core/testing';

import { WikidataCommunicationService } from './wikidata-communication.service';

describe('WikidataCommunicationService', () => {
  let service: WikidataCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WikidataCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
