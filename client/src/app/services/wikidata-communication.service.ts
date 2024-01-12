import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistoricalEvents } from '../interfaces/historical-events';

@Injectable({
    providedIn: 'root',
})
export class WikidataCommunicationService {
    private readonly baseUrl: string = environment.serverUrl;

    constructor(private http: HttpClient) {}

    getEventsByYear(year: string): Observable<HistoricalEvents[]> {
        return this.http
            .get<HistoricalEvents[]>(`${this.baseUrl}/events/${year}`)
            .pipe(catchError(this.receiveError<HistoricalEvents[]>()));
    }

    private receiveError<T>() {
        return (error: HttpErrorResponse): Observable<T> => {
            const errorMessage = `${error.error}`;
            throw new Error(errorMessage);
        };
    }
}
