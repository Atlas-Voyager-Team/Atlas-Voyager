import { Test, TestingModule } from '@nestjs/testing';
import { WikiCommunicationController } from './wiki-communication.controller';

describe('WikiControllerController', () => {
    let controller: WikiCommunicationController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WikiCommunicationController],
        }).compile();

        controller = module.get<WikiCommunicationController>(WikiCommunicationController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
