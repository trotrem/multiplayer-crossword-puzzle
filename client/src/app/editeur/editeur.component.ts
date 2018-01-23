import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';


@Component({
  selector: 'app-editeur',
  templateUrl: './editeur.component.html',
  styleUrls: ['./editeur.component.css']
})


export class EditeurComponent implements OnInit {

  @ViewChild('canvas')
  private canvasRef: ElementRef;

  private camera: THREE.OrthographicCamera;

  private scene: THREE.Scene;

  private renderer: THREE.Renderer;


  private get canvas() : HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  


  constructor() { }

  

  ngOnInit() {
    this.createScene();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.camera.lookAt(this.scene.position);
    this.animate();
  }

  createScene() {
    this.camera = new THREE.OrthographicCamera(window.screen.width / - 2, window.screen.width / 2, window.screen.height / 2, window.screen.height / - 2, 1, 1000);  
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  }
}
