import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { Vector3 } from 'three';

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

  private arrayPoints :THREE.Vector3[];





  private get canvas() : HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  constructor() { }

  ngAfterViewInit() {
    this.createScene();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.animate();
    this.canvas.addEventListener('click', (event) => this.onClick(event));
  }

  createScene() {
    this.camera  = new THREE.PerspectiveCamera();
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(new THREE.Vector3(0,0,0));
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.arrayPoints = new Array();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  createDot(position : any) {
    let geometryPoint = new THREE.Geometry();
    geometryPoint.vertices.push(position);
    let material = new THREE.PointsMaterial({ size :1,color: 0x88d8b0 });
    let dot = new THREE.Points(geometryPoint, material);
    this.scene.add( dot );
  }

  convertToWorldPosition(event: any){
    let rect = this.canvas.getBoundingClientRect();
    let canvasPos = new Vector3(event.clientX - rect.left, event.clientY - rect.top);
    let vector = new THREE.Vector3((canvasPos.x / this.canvas.width)*2-1,-(canvasPos.y / this.canvas.height)*2+1 , 0);
    vector.unproject(this.camera);
    let dir = vector.sub(this.camera.position);
    let distance = - this.camera.position.z / dir.z;
    console.log(this.camera.position.clone().add(dir.multiplyScalar(distance)));
    return this.camera.position.clone().add(dir);
  }

  onClick(event:any) {
    if(event.which === 1)
      this.onLeftClick(event);
    if(event.which === 3)
      this.onRightClick();
  }

  onLeftClick(event:any) {
    let position = this.convertToWorldPosition(event);
    this.createDot(position);
    this.arrayPoints.push(position);
    if(this.arrayPoints.length > 1)
      this.createLine();
  }

  onRightClick() {
    let nbChildren = this.scene.children.length;
    if(this.arrayPoints.length > 1) {
      this.arrayPoints.pop();
      this.scene.remove(this.scene.children[nbChildren - 1]);
      this.scene.remove(this.scene.children[nbChildren - 2]);
    }
    else if(this.arrayPoints.length === 1){
      this.arrayPoints.pop();
      this.scene.remove(this.scene.children[0]);
    }
  }
  
  createLine(){
    let geometryLine= new THREE.Geometry;
    geometryLine.vertices.push(this.arrayPoints[this.arrayPoints.length-1]);
    geometryLine.vertices.push(this.arrayPoints[this.arrayPoints.length-2]);
    let line = new THREE.Line(geometryLine,new THREE.LineBasicMaterial({color:0x88d8b0}));
    this.scene.add(line);
  }
}
