import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';


@Component({
  selector: 'app-editeur',
  templateUrl: './editeur.component.html',
  styleUrls: ['./editeur.component.css']
})


export class EditeurComponent implements AfterViewInit {

  @ViewChild('canvas')
  private canvasRef: ElementRef;

  private camera: THREE.PerspectiveCamera;

  private scene: THREE.Scene;

  private renderer: THREE.Renderer;




  private get canvas() : HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  


  constructor() { }

  

  ngAfterViewInit() {
    this.createScene();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.camera.lookAt(this.scene.position);
    this.createDot();
    this.animate();

  }

  createScene() {
    this.camera = new THREE.PerspectiveCamera(70,window.innerWidth/ window.innerHeight,0.1,1000 );  
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
  }


  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
  createDot() {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var material = new THREE.PointsMaterial({ size :1,color: 0x0000ff });
    var dot = new THREE.Points(geometry, material);
    this.scene.add( dot );
    this.camera.position.z = 100;
   
  }
}
