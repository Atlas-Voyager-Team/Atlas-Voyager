import { Test, TestingModule } from '@nestjs/testing';
import { WikiCommunicationService } from './wiki-communication.service';

describe('WikiCommunicationService', () => {
    let service: WikiCommunicationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [WikiCommunicationService],
        }).compile();

        service = module.get<WikiCommunicationService>(WikiCommunicationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
