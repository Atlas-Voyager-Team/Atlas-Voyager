import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { Raycaster, Vector2 } from 'three';

import { WikidataCommunicationService } from '../../services/wikidata-communication.service';
import { HistoricalEvents } from '../../interfaces/historical-events';
import { EventsService } from '../../services/events-service.service';

@Component({
    selector: 'app-earth',
    templateUrl: './earth.component.html',
    styleUrl: './earth.component.scss',
})
export class EarthComponent implements OnInit, AfterViewInit {
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private controls!: ArcballControls;
    private ambient_light!: THREE.AmbientLight;
    private camera_light!: THREE.DirectionalLight;
    private last_render: number = Date.now();

    private earth!: THREE.Object3D;
    private tx: number = 0;

    private earthRadius = 15;

    private raycaster = new Raycaster();
    private mouse = new Vector2();
    private interactiveObjects = new Array<THREE.Object3D>();

    private textBoxCreated: boolean = false;
    selectedYear: string = '1944';

    @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

    constructor(private eventsService: EventsService) {}

    ngOnInit(): void {}

    private init(): void {
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.nativeElement, antialias: true });
        this.renderer.setSize(this.canvasRef.nativeElement.clientWidth, this.canvasRef.nativeElement.clientHeight);

        this.createScene();

        this.controls = new ArcballControls(this.camera, this.renderer.domElement, this.scene);
        this.controls.setGizmosVisible(false);
        this.animate();
    }

    private createScene(): void {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0, 0, 0);
        this.ambient_light = new THREE.AmbientLight('white', 2.0);
        this.scene.add(this.ambient_light);

        const lightIntensity = 0;
        this.addDirectionalLight(1, 0, 0, lightIntensity); // right
        this.addDirectionalLight(-1, 0, 0, lightIntensity); // left
        this.addDirectionalLight(0, 1, 0, lightIntensity); // above
        this.addDirectionalLight(0, -1, 0, lightIntensity); // below

        this.camera = new THREE.PerspectiveCamera(
            45,
            this.canvasRef.nativeElement.clientWidth / this.canvasRef.nativeElement.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(2, 2, 50);
        this.camera.lookAt(this.scene.position);
        this.scene.add(this.camera);

        this.ambient_light = new THREE.AmbientLight('white', 0.0);
        this.scene.add(this.ambient_light);

        this.camera_light = new THREE.DirectionalLight('white', 0.0);
        this.camera.add(this.camera_light);

        this.draw_earth();
    }

    private addDirectionalLight(x: number, y: number, z: number, intensity: number): void {
        const directionalLight = new THREE.DirectionalLight(0xffffff, intensity);
        directionalLight.position.set(x, y, z);
        this.scene.add(directionalLight);
    }

    private draw_earth(): void {
        const mtlLoader = new MTLLoader();
        mtlLoader.setPath('assets/');
        mtlLoader.load('EarthSphere.mtl', (materials) => {
            materials.preload();

            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('assets/');

            objLoader.load('EarthSphere.obj', (object) => {
                object.scale.set(15, 15, 15);
                object.position.set(0, 0, 0);
                this.earth = object;
                this.scene.add(this.earth);
            });
        });
    }

    private animate(): void {
        const run_animation: boolean = (document.getElementById('toggleAnimation') as HTMLInputElement).checked;
        if (run_animation) {
            this.tx += 0.02;
            if (this.earth) {
                this.earth.rotation.y = this.tx;
            }
        }

        this.last_render = Date.now();
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }

    onDocumentMouseDown(event: MouseEvent): void {
        event.preventDefault();

        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObject(this.earth, true);
        const markerIntersects = intersects.filter((intersect) => intersect.object.userData['isMarker']);

        if (markerIntersects.length > 0) {
            this.showOrUpdateTextBox(markerIntersects[0]);
        }
    }

    showOrUpdateTextBox(intersect: THREE.Intersection): void {
        const marker = intersect.object;

        // Update the content of the text box
        const title = marker.userData['title'];
        const description = marker.userData['description'];
        const url = marker.userData['url'];

        // Update the content of the text box with event information
        const textBox = document.getElementById('info-text-box') as HTMLDivElement;
        const contentBox = textBox.getElementsByClassName('content-box')[0] as HTMLDivElement;
        contentBox.innerHTML = `<h1>${title}</h1><p>${description}</p><a href="${url}" target="_blank">Read more</a>`;
        textBox.style.display = 'block';

        const closeButton = textBox.getElementsByClassName('close-button')[0] as HTMLButtonElement;
        closeButton.onclick = () => this.hideTextBox();
    }

    hideTextBox(): void {
        const textBox = document.getElementById('info-text-box') as HTMLDivElement;
        textBox.style.display = 'none';
    }

    onYearSelectionChange(event: Event): void {
        this.selectedYear = (event.target as HTMLInputElement).value;
        document.getElementById('selectedYear')!.innerText = this.selectedYear;
    }

    onConfirmYear(): void {
        this.clearMarkers();
        this.eventsService.fetchEventsAndPlaceMarkers(this.selectedYear, this.earth, this.earthRadius);
    }

    clearMarkers(): void {
        const markersToRemove = this.earth.children.filter((child) => child.userData['isMarker']);

        markersToRemove.forEach((marker) => {
            this.earth.remove(marker);
        });
    }

    // Example usage
    ngAfterViewInit(): void {
        this.init();
        this.renderer.domElement.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false);

        const yearRangeElement = document.getElementById('yearRange') as HTMLInputElement;
        yearRangeElement.addEventListener('input', this.onYearSelectionChange.bind(this));

        const confirmYearButton = document.getElementById('confirmYearButton') as HTMLButtonElement;
        confirmYearButton.addEventListener('click', this.onConfirmYear.bind(this));
    }
}
