import { Injectable } from '@angular/core';
import { HistoricalEvents } from '../interfaces/historical-events';
import * as THREE from 'three';
import { WikidataCommunicationService } from './wikidata-communication.service';
import { EarthLoadingComponent } from '../components/earth-loading/earth-loading.component';

@Injectable({
    providedIn: 'root',
})
export class EventsService {
    constructor(
        private wikiDataService: WikidataCommunicationService,
        private earthLoadingComponent: EarthLoadingComponent
    ) {}

    addMarker(lat: number, lon: number, eventInfo: HistoricalEvents, earth: THREE.Object3D, earthRadius: number): void {
        const position = this.latLonToSphere(lat, lon, earthRadius);
        console.log(`Marker Position: ${position.x}, ${position.y}, ${position.z}`);

        const markerGeometry = new THREE.SphereGeometry(0.01, 32, 32);
        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);

        // Apply the inverse of the Earth object's world matrix to the position
        earth.updateMatrixWorld(true);
        const inverseMatrix = new THREE.Matrix4().copy(earth.matrixWorld).invert();
        position.applyMatrix4(inverseMatrix);

        marker.userData = {
            isMarker: true,
            title: eventInfo.itemLabel,
            description: eventInfo.itemDescription,
            url: eventInfo.wikiArticleUrl,
        };

        // Marker added as a child to earth
        marker.position.set(position.x, position.y, position.z);
        earth.add(marker);
        marker.userData['isMarker'] = true;
        console.log('Marker added to Earth');
    }

    latLonToSphere(lat: number, lon: number, radius: number): THREE.Vector3 {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        return new THREE.Vector3(x, y, z);
    }

    fetchEventsAndPlaceMarkers(year: string, earth: THREE.Object3D, earthRadius: number): void {
        this.earthLoadingComponent.showLoadingScreen();
        this.wikiDataService.getEventsByYear(year).subscribe(
            (events: HistoricalEvents[]) => {
                events.forEach((event) => {
                    console.log(event);
                    if (event.coordinates && typeof event.coordinates === 'string') {
                        const coords = event.coordinates.match(/Point\(([^ ]+) ([^ ]+)\)/);
                        if (coords) {
                            const lon = parseFloat(coords[1]);
                            const lat = parseFloat(coords[2]);
                            this.addMarker(lat, lon, event, earth, earthRadius);
                        }
                    }
                    this.earthLoadingComponent.hideLoadingScreen();
                });
            },
            (error) => console.error('Error fetching events:', error)
        );
    }
}
