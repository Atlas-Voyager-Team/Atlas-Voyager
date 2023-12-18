import { Controller, Get, Param } from '@nestjs/common';
import { WikiCommunicationService } from 'src/services/wiki-communication/wiki-communication.service';

@Controller('')
export class WikiCommunicationController {
    constructor(private readonly wikiCommunicationService: WikiCommunicationService) {}

    @Get('events/:year')
    getEvents(@Param('year') year: string) {
        return this.wikiCommunicationService.getHistoricalData(year);
    }

    @Get('countries/:year')
    getCountries(@Param('year') year: string) {
        return this.wikiCommunicationService.getCountriesByYear(year);
    }
}
