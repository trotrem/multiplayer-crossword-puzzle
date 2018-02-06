import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import * as THREE from "three";
import { EditeurComponent } from "./editeur.component";

// "magic numers" utilisés pour les tests
/* tslint:disable:no-magic-numbers */

describe("EditeurComponent", () => {
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

    it("should create the EditeurComponent", () => {
        expect(component).toBeDefined();
    });

    it("should create a scene", () => {
        component.createScene();
        expect(component.getScene().children.length).toBe(0);
    });

    it("should create a point", () => {
        const position: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
        component.createPoint(position);
        expect(component.getScene().children.length).toBe(1);
    });

    it("should create a segment", () => {
        const array: Array<THREE.Vector3> = new Array<THREE.Vector3>();
        const position1: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
        array.push(position1);
        component.arrayPoints = array;
        const position2: THREE.Vector3 = new THREE.Vector3(23, -2, 0);
        component.createLine(position1, position2);
        expect(component.getScene().children.length).toBe(1);
    });
});
