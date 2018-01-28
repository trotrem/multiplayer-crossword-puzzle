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

  private isClosed : boolean;

  private get canvas() : HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  constructor() { }

  ngAfterViewInit() {
    this.createScene();
    this.animate();

    this.arrayPoints = new Array();

    this.canvas.addEventListener('click', (event) => this.onLeftClick(event));
    this.canvas.addEventListener('contextmenu', function(e) {  
      e.preventDefault();  
      this.onRightClick();
    }.bind(this));
  }

  createScene() {
    this.camera  = new THREE.PerspectiveCamera();
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(new THREE.Vector3(0,0,0));
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  onLeftClick(event:any) {
    if(this.isClosed) {
      return
    }

    let position = this.getPlacementPosition(event);
    
    this.createPoint(position);

    if(this.arrayPoints.length > 0) {
      this.createLine(position);
    }

    this.arrayPoints.push(position);
  }

  onRightClick() {
    this.isClosed = false;
    let nbChildren = this.scene.children.length;
    if(this.arrayPoints.length > 0) {
      this.arrayPoints.pop();
      this.scene.remove(this.scene.children[nbChildren - 1]);
      this.scene.remove(this.scene.children[nbChildren - 2]);
    }
  }

  createFirstPointContour(position : any) {
    let geometryPoint = new THREE.Geometry();
    geometryPoint.vertices.push(position);
    let material = new THREE.PointsMaterial({ size :2,color: 0xFAA61A });
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
    return this.camera.position.clone().add(dir.multiplyScalar(distance));
  }

  getPlacementPosition(event:any) {
    let position = this.convertToWorldPosition(event);
    if(this.arrayPoints.length > 2 && position.distanceTo(this.arrayPoints[0]) < 1)
    {
      position = this.arrayPoints[0];
      this.isClosed = true;
    }
    return position;
  }

  createPoint(position : any) {
    if(this.arrayPoints.length === 0) {
      this.createFirstPointContour(position);
    }

    let geometryPoint = new THREE.Geometry();
    geometryPoint.vertices.push(position);
    let material = new THREE.PointsMaterial({ size :1,color: 0x88d8b0 });
    let dot = new THREE.Points(geometryPoint, material);
    this.scene.add( dot );
  }

  createLine(position:any){
    let geometryLine= new THREE.Geometry;
    geometryLine.vertices.push(this.arrayPoints[this.arrayPoints.length-1]);
    geometryLine.vertices.push(position);
    let line = new THREE.Line(geometryLine,new THREE.LineBasicMaterial({color:0x88d8b0}));
    this.scene.add(line);
  }
}
