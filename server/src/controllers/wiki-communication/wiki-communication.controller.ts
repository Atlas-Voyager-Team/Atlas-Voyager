import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { WikiCommunicationService } from 'src/services/wiki-communication/wiki-communication.service';

@Controller('')
export class WikiCommunicationController {
    constructor(private readonly wikiCommunicationService: WikiCommunicationService) {}

    @Get('events/:year')
    async getEvents(@Param('year') year: string, @Res() response: Response) {
        if (!/^-\d+$|^\d+$/.test(year)) {
            return response
                .status(HttpStatus.BAD_REQUEST)
                .send('Invalid year format. Year should be a number (string).');
        }

        try {
            const events = await this.wikiCommunicationService.getHistoricalData(year);
            response.status(HttpStatus.OK).json(events);
        } catch (error) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Failed to get events: ' + error.message);
        }
    }

    @Get('countries/:year')
    getCountries(@Param('year') year: string) {
        try {
            return this.wikiCommunicationService.getCountriesByYear(year);
        } catch (e) {
            throw new Error('Error getting countries by year');
        }
    }
}
