import { TestBed, inject } from "@angular/core/testing";
import * as THREE from "three";

import { PrintTrackService } from "./print-track.service";
import { PrintCarsService } from "../printCar.service/print-cars.service";
// "magic numbers" utilisés pour les tests
/* tslint:disable:no-magic-numbers */

describe("PrintTrackService", () => {
  // tslint:disable-next-line:prefer-const
  let canvas: HTMLCanvasElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrintTrackService,  HTMLCanvasElement]
    });
  });

  it("should be created", inject([PrintTrackService], (service: PrintTrackService) => {
    service.initialize(canvas);
    expect(service).toBeTruthy();
  }));
  it("should create a scene", inject([PrintTrackService], (service: PrintTrackService) => {
    service.initialize(canvas);
    expect(service.getScene().children.length).toBe(8);
  }));
  it("should draw a track", inject([PrintTrackService], (service: PrintTrackService) => {
    const points: Array<THREE.Vector3> = new Array<THREE.Vector3>();
    const position1: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
    const position2: THREE.Vector3 = new THREE.Vector3(-12, 9, 0);
    const position3: THREE.Vector3 = new THREE.Vector3(-50, -2, 0);
    const position4: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
    points.push(position1);
    points.push(position2);
    points.push(position3);
    points.push(position4);
    service.initialize(canvas);
    service.drawTrack(points);
    expect(service.getScene().children.length).toBe(11);
  }));
  it("should declare four cars", inject([PrintTrackService], (service: PrintTrackService, service2: PrintCarsService) => {
    const points: Array<THREE.Vector3> = new Array<THREE.Vector3>();
    const position1: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
    const position2: THREE.Vector3 = new THREE.Vector3(-12, 9, 0);
    const position3: THREE.Vector3 = new THREE.Vector3(-50, -2, 0);
    const position4: THREE.Vector3 = new THREE.Vector3(-23, -2, 0);
    points.push(position1);
    points.push(position2);
    points.push(position3);
    points.push(position4);
    service.initialize(canvas);
    service.drawTrack(points);
    service.insertCars(new THREE.Line3(position1, position2));
    expect(service.getCars).toBeDefined();
  }));

});
