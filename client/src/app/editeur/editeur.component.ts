import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import {Contraintes} from '../contraintes'
const MAX_SELECTION_DISTANCE: number = 2;

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

  private arrayPoints: THREE.Vector3[];

  private isClosed: boolean;

  private dragIndex: number;

  private contraintes: Contraintes;

  private get canvas() : HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  constructor() { }

  ngAfterViewInit() {
    this.createScene();
    this.animate();
    this.subscribeEvents();

    this.dragIndex = -1;
    this.arrayPoints = new Array();
    this.contraintes = new Contraintes();
  }

  subscribeEvents() {
    this.canvas.addEventListener('click', (event:any) => this.onLeftClick(event));
    this.canvas.addEventListener('contextmenu', (event:any) => {  
      event.preventDefault();  
      this.onRightClick();
    });
    this.canvas.addEventListener('dragstart', (event:any) => {
      this.dragIndex = this.getDraggedPointIndex(event);
    });
    this.canvas.addEventListener('dragend', (event:any) => {
      this.onDragEnd(event);
    });
  }

  public createScene(): void {
    this.camera  = new THREE.PerspectiveCamera();
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(new THREE.Vector3(0,0,0));
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  public animate():void {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  public onLeftClick(event:any): void {
    if(this.isClosed) {
      return null;
    }

    let position = this.getPlacementPosition(event);

    if(this.arrayPoints.length === 0) {
      this.createFirstPointContour(position);
    }
    this.createPoint(position);

    if(this.arrayPoints.length > 0) {
      this.createLine(position, this.arrayPoints[this.arrayPoints.length-1]);
    }

    this.arrayPoints.push(position);
  }

  public onRightClick(): void {
    this.isClosed = false;
    let nbChildren = this.scene.children.length;
    if(this.arrayPoints.length > 0) {
      this.arrayPoints.pop();
      this.scene.remove(this.scene.children[nbChildren - 1]);
      this.scene.remove(this.scene.children[nbChildren - 2]);
    }
  }

  private onDragEnd(event:any): void {
    event.preventDefault();
    let tempArray = this.arrayPoints;
    this.arrayPoints = [];
    let position = this.convertToWorldPosition(event)
    tempArray[this.dragIndex] = position;
    if(this.dragIndex === tempArray.length - 1 && this.isClosed) {
      tempArray[0] = position;
    }
    this.dragIndex = -1;
    this.redraw(tempArray);
  }

  getDraggedPointIndex(event:any) {
    let position = this.convertToWorldPosition(event);
    let index = -1;
    this.arrayPoints.forEach((point, i) => {
      if(position.distanceTo(point) < MAX_SELECTION_DISTANCE) {
        index = i
      };
    });
    return index;
  }

 private convertToWorldPosition(event: THREE.Vector3): THREE.Vector3 {
    let rect = this.canvas.getBoundingClientRect();
    let canvasPos = new THREE.Vector3(event.x - rect.left, event.y - rect.top);
    let vector = new THREE.Vector3((canvasPos.x / this.canvas.width)*2-1,-(canvasPos.y / this.canvas.height)*2+1 , 0);
    vector.unproject(this.camera);
    let dir = vector.sub(this.camera.position);
    let distance = - this.camera.position.z / dir.z;
    return this.camera.position.clone().add(dir.multiplyScalar(distance));
  }

  private getPlacementPosition(event:THREE.Vector3): THREE.Vector3 {
    let position = this.convertToWorldPosition(event);
    if(this.arrayPoints.length > 2 && position.distanceTo(this.arrayPoints[0]) < MAX_SELECTION_DISTANCE)
    {
      position = this.arrayPoints[0];
      this.isClosed = true;
    }
    return position;
  }

  private createFirstPointContour(position : THREE.Vector3): void {
    let geometryPoint = new THREE.Geometry();
    geometryPoint.vertices.push(position);
    let material = new THREE.PointsMaterial({ size :5,color: 0xFAA61A });
    let dot = new THREE.Points(geometryPoint, material);
    this.scene.add( dot );
  }

  public createPoint(position : THREE.Vector3): void {
    let geometryPoint = new THREE.Geometry();
    geometryPoint.vertices.push(position);
    let material = new THREE.PointsMaterial({ size :3,color: 0xff00a7 });
    let dot = new THREE.Points(geometryPoint, material);
    this.scene.add( dot );
  }

  public createLine(position: THREE.Vector3, last: THREE.Vector3): void {
    let arrayTmp = new Array();
    let color;
    arrayTmp = this.contraintes.isValid(this.arrayPoints, position, last);
    
    if (arrayTmp.length == 0)
      color = 0x88d8b0;
    else {
      color = 0xFF0000;//red
      console.log(arrayTmp);
      for (let i = 0; i < arrayTmp.length; i += 2) {
        let index = this.arrayPoints.indexOf(arrayTmp[i]);

        this.scene.remove(this.scene.children[index+1]);
        let geoLine = new THREE.Geometry;
        geoLine.vertices.push(arrayTmp[i]);
        geoLine.vertices.push(arrayTmp[i+1]);
        let line = new THREE.Line(geoLine, new THREE.LineBasicMaterial({ 'linewidth': 6, color }));
        this.scene.add(line);
      }
    }
    let geometryLine = new THREE.Geometry;
    geometryLine.vertices.push(last);
    geometryLine.vertices.push(position);
    let line = new THREE.Line(geometryLine, new THREE.LineBasicMaterial({ 'linewidth': 6, color }));
    this.scene.add(line);

  }

  private redraw(newArray:THREE.Vector3[]): void {
    if(!newArray) {
      return
    }

    while(this.scene.children.length > 0){ 
      this.scene.remove(this.scene.children[0]); 
    }
    
    this.createFirstPointContour(newArray[0]);
    this.createPoint(newArray[0]);
    this.arrayPoints.push(newArray[0]);
    for(let position of newArray.slice(1)) {
      this.createLine(position, this.arrayPoints[this.arrayPoints.length-1]);
      this.createPoint(position);
      this.arrayPoints.push(position);
    }
  }
}
