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


  it('should create the EditeurComponent ', () => {

    expect(component).toBeDefined();
  });
  it('should create a scene', () => {

    component.createScene();
    expect(component.getScene().children.length).toBe(0);
  });

  it('should create a point', () => {

    let position = new THREE.Vector3(-23,-2,0);
    component.createPoint(position);
    expect(component.getScene().children.length).toBe(1);
  });
});
