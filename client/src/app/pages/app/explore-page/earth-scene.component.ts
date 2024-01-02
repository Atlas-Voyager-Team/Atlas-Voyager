import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Raycaster, Vector2 } from 'three';

@Component({
  selector: 'app-earth-scene',
  templateUrl: './earth-scene.component.html',
  styleUrls: ['./earth-scene.component.scss']
})
export class EarthSceneComponent implements OnInit, AfterViewInit {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: ArcballControls;
  private ambient_light!: THREE.AmbientLight;
  private camera_light!: THREE.DirectionalLight;
  private last_render: number = Date.now();

  private planetTexture!: THREE.Texture;
  private earth!: THREE.Object3D;
  private directionalLight!: THREE.DirectionalLight;
  private tx: number = 0;

  private earthRadius = 15; 

  private raycaster = new Raycaster();
  private mouse = new Vector2();
  private interactiveObjects = new Array<THREE.Object3D>(); 

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor() { }

  ngOnInit(): void {
  }


  private createScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0, 0, 0);
    
    // intensity
    this.ambient_light = new THREE.AmbientLight("white", 2.0); 
    this.scene.add(this.ambient_light);

    const lightIntensity = 0;
    this.addDirectionalLight(1, 0, 0, lightIntensity); // right
    this.addDirectionalLight(-1, 0, 0, lightIntensity); // left
    this.addDirectionalLight(0, 1, 0, lightIntensity); // above
    this.addDirectionalLight(0, -1, 0, lightIntensity); // below

    this.camera = new THREE.PerspectiveCamera(45, this.canvasRef.nativeElement.clientWidth / this.canvasRef.nativeElement.clientHeight, 0.1, 1000);
    this.camera.position.set(2, 2, 20);
    this.camera.lookAt(this.scene.position);
    this.scene.add(this.camera);
    
    this.ambient_light = new THREE.AmbientLight("white", 0.0);
    this.scene.add(this.ambient_light);
    
    this.camera_light = new THREE.DirectionalLight("white", 0.0);
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
    const run_animation: boolean = (document.getElementById("toggleAnimation") as HTMLInputElement).checked;
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

  private init(): void {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.nativeElement, antialias: true });
    this.renderer.setSize(this.canvasRef.nativeElement.clientWidth, this.canvasRef.nativeElement.clientHeight);
    
    this.createScene();
    
    this.camera = new THREE.PerspectiveCamera(45, this.canvasRef.nativeElement.clientWidth / this.canvasRef.nativeElement.clientHeight, 0.1, 1000);
    this.camera.position.set(2, 2, 50);
    this.scene.add(this.camera);

    this.controls = new ArcballControls(this.camera, this.renderer.domElement, this.scene);
    this.controls.setGizmosVisible(false);
    this.animate(); 

    this.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this), false);

  }

  private addMarker(lat: number, lon: number): void {
    const position = this.latLonToSphere(lat, lon, this.earthRadius);
    const markerGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.set(position.x, position.y, position.z);
    this.scene.add(marker);
    this.interactiveObjects.push(marker); // Add the marker to the list of interactive objects
  }

  private latLonToSphere(lat: number, lon: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
  }

  private onMouseClick(event: MouseEvent): void {
    // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
    this.mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects);

    if (intersects.length > 0) {
      // Assuming the first object is the one we're interested in
      this.showPopup(intersects[0].object);
    }
  }

  private showPopup(object: THREE.Object3D): void {
    // Your logic to show a pop-up window
    // For example, you can set some property that you use with Angular's *ngIf directive to show a pop-up
    alert(`Clicked on marker at: ${object.position}`);
  }

  // Example usage
  ngAfterViewInit(): void {
    this.init();
    this.addMarker(51.5, 0.13); 
  }
}

