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
    this.animate();
    this.canvas.addEventListener('click', (event) => this.onClick(event), false);

  }

  createScene() {
    this.camera = new THREE.PerspectiveCamera(70,window.innerWidth/ window.innerHeight,0.1,1000 );
    this.camera.lookAt(new THREE.Vector3(0,0,0));
    this.camera.position.set(0,0,100);
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  createDot(position) {
    let geometry = new THREE.Geometry();
    geometry.vertices.push(position);
    let material = new THREE.PointsMaterial({ color: 0x88d8b0 });
    let dot = new THREE.Points(geometry, material);
    this.scene.add( dot );
  }

  convertToCanvasPosition(event){
    let vector = new THREE.Vector3((event.clientX / window.innerWidth)*2-1,-(event.clientY / window.innerHeight)*2+1 , 0.5);
    vector.unproject(this.camera);
    let dir = vector.sub(this.camera.position);
    let distance = - this.camera.position.z / dir.z;
    return this.camera.position.clone().add(dir.multiplyScalar(distance));
  }

  onClick(event) {
    let position = this.convertToCanvasPosition(event);
    console.log(position);
    this.createDot(position);
  }
}
