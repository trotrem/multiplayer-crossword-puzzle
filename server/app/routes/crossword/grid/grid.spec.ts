import { expect } from 'chai';
// import {test} from 'mocha';
import { Grid } from "./grid";

const asserdt = require('assert');

it('I should complete this test', (done) => {
    asserdt.ok(true);
    done();
});

it('Should be 10 witdh and 10 height', (taille) => {
    let grid = new Grid();
    expect(grid.getHeight).equals(10);
    taille();
});
 it('Should contains black square',(black) =>{
    let grid = new Grid();
    let compteurBlack:number;
    const nbrBlack = grid.getNbrBlack();
    for(let indexI =0 ; indexI < grid.getHeight(); indexI++){
        for(let indexJ = 0 ;  indexJ < grid.getHeight(); indexJ++){
            if(grid.getSquareIsBlack(indexI,indexJ)){
                compteurBlack ++;
            }
        }
    }
    expect(compteurBlack).equals(nbrBlack);
    black();
 });
 
