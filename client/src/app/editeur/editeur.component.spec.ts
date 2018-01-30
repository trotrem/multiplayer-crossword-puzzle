import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as THREE from 'three';
import { EditeurComponent } from './editeur.component';

describe('EditeurComponent', () => {
  let component: EditeurComponent;
  let fixture: ComponentFixture<EditeurComponent>;
  let position : THREE.Vector3;
  position = new THREE.Vector3(0,0,0);

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create a point',function (){
    let position : THREE.Vector3;
    position = new THREE.Vector3(1,2,0);

    component.createPoint(position);
    expect(component).toBeDefined();
  )};

});
