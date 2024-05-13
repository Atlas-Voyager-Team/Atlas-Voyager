import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WikidataCommunicationService } from '../../services/wikidata-communication.service';
import { firstValueFrom } from 'rxjs';
import { HistoricalEvents } from '../../interfaces/historical-events';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
    constructor(private router: Router, private wikiDataCommunicationService: WikidataCommunicationService) {}

    NavigateToExplorePage(): void {
        this.router.navigate(['/explore']);
    }

    // async HistoricalEventTest(): Promise<HistoricalEvents[]> {
    //     const results = await firstValueFrom(this.wikiDataCommunicationService.getEventsByYear('2013'));
    //     console.log(results);
    //     return results;
    // }
}
