import { expect } from 'chai';
import { ListWord } from "./listWords";
import { Grid } from './grid';
import { Word } from './word';

const asserdt = require('assert');
const TAILLEMIN = 2;

it('I should complete this test', (done) => {
    asserdt.ok(true);
    done();
});

it('Should have words with a minimum of two letters', (letter) => {
    let isMinimum: boolean = true;
    let grid = new Grid();
    let list = new ListWord(grid);
    let listH = list.getListOfWordH();
    let listV = list.getListOfWordH();
    for (let word = 0; word < list.getLengthOfH(); word++) {
        if (listH[word].getLength() < TAILLEMIN) {
            isMinimum = false;
        }
    }
    for (let word = 0; word < list.getLengthOfV(); word++) {
        if (listV[word].getLength() < TAILLEMIN) {
            isMinimum = false;
        }
    }
    expect(isMinimum);
    letter();
})