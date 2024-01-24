import { Component } from '@angular/core';

@Component({
    selector: 'app-earth-loading',
    templateUrl: './earth-loading.component.html',
    styleUrl: './earth-loading.component.scss',
})
export class EarthLoadingComponent {
    showLoadingScreen(): void {
        const loadingScreen = document.getElementById('loadingScreen') as HTMLDivElement;
        loadingScreen.style.display = 'flex';
    }

    hideLoadingScreen(): void {
        const loadingScreen = document.getElementById('loadingScreen') as HTMLDivElement;
        loadingScreen.style.display = 'none';
    }
}
