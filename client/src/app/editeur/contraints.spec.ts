import { Contraints } from './contraints';
import * as THREE from 'three';
describe('Contraints', () => {
  let contraints = new Contraints();
  it('should create the object contraints', () => {
    expect(contraints).toBeDefined();
  });
  it('shouldnt accept two segements forming an angle below 45 degree', () => {

    let array = new Array<THREE.Vector3>();
    array.push(new THREE.Vector3(-18.6,15.6,0));
    //let position = new THREE.Vector3(-18.6,15.6,0);
    let position1 = new THREE.Vector3(-18.3,-23.6,0);
    array.push(position1);
    let position2 = new THREE.Vector3(-13.3,17.9,0 );
    expect(contraints.isValid(array,position1,position2).length).toBe(2);
  });

  it('shouldnt accept a segement smaller than MAX_LENGHT', () => {

    let array = new Array<THREE.Vector3>();
    array.push(new THREE.Vector3(-22.5,17.5,0));
    //let position = new THREE.Vector3(-18.6,15.6,0);
    let position1 = new THREE.Vector3(-24,-22.6, 0);
    array.push(position1);
    let position2 = new THREE.Vector3(-10.3,-23.3,0 );
    expect(contraints.isValid(array,position1,position2).length).toBe(1);
  });

  it('shouldnt accept two segements crossing', () => {

    let array = new Array<THREE.Vector3>();
    array.push(new THREE.Vector3( -27.7, 24.4,0));
    array.push(new THREE.Vector3(-28.5, -25, 0));
    array.push(new THREE.Vector3(10,-26,0));
    let position1 = new THREE.Vector3(12,6,0);
    array.push(position1);
    let position2 = new THREE.Vector3(-42,7.7,0 );
    expect(contraints.isValid(array,position1,position2).length).toBe(2);
  });
});
