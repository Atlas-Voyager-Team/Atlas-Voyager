import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WikiCommunicationService } from './services/wiki-communication/wiki-communication.service';
import { WikiCommunicationController } from './controllers/wiki-communication/wiki-communication.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    controllers: [AppController, WikiCommunicationController],
    providers: [AppService, WikiCommunicationService],
})
export class AppModule {}
