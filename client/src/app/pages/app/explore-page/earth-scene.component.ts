import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

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
  private theta1: number = 0;
  private theta2: number = 0;
  private tx: number = 0;

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.init();
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
    // Instantiate a loader for .mtl files
    const mtlLoader = new MTLLoader();
    
    // Set the path to the directory containing the .mtl file and the textures
    mtlLoader.setPath('assets/');
    
    // Load the .mtl file
    mtlLoader.load('EarthSphere.mtl', (materials) => {
      // Preload the materials
      materials.preload();
      
      // Instantiate the OBJLoader and set the materials to be used
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      
      // Set the path to the directory containing the .obj file
      objLoader.setPath('assets/');
      
      // Load the .obj file
      objLoader.load('EarthSphere.obj', (object) => {
        // Apply the scale and position transformations
        object.scale.set(15, 15, 15);
        object.position.set(0, 0, 0);
  
        // Assign the loaded object to a class property if needed
        this.earth = object;
  
        // Add the object to the scene
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
    
    //const textureLoader = new THREE.TextureLoader();
    //this.planetTexture = textureLoader.load('assets/NaturalEarth.png', (texture) => {
      //texture.minFilter = THREE.LinearFilter;
    //});

    this.camera = new THREE.PerspectiveCamera(45, this.canvasRef.nativeElement.clientWidth / this.canvasRef.nativeElement.clientHeight, 0.1, 1000);
    this.camera.position.set(2, 2, 50);
    this.scene.add(this.camera);

    this.controls = new ArcballControls(this.camera, this.renderer.domElement, this.scene);
    this.controls.setGizmosVisible(false);

    this.animate(); 
  }
}

