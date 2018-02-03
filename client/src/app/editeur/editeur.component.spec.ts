import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as THREE from 'three';
import { EditeurComponent } from './editeur.component';

describe('EditeurComponent', () => {
  let component: EditeurComponent;
  let fixture: ComponentFixture<EditeurComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditeurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('createPoint', () => {
    it('should create a point', () => {
      let position = new THREE.Vector3(-23,-2,0);
      component.createPoint(position);
      expect(component).toBeTruthy();
  })});

  describe('createLine', () => {
    it('should create a segment',()=> {
      let position1 = new THREE.Vector3(-23,-2,0);
      let position2 = new THREE.Vector3(-3,2,0);
      component.createLine(position1,position2);
      expect(component).toBeDefined();
    })
  });
});
