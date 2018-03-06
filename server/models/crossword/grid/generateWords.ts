import { Grid } from "./grid";
import { WordRetriever } from "../lexiconAPI/wordRetriever";
import { WordDictionaryData } from "../lexiconAPI/gridWordInformation";
 
const wordRetriever: WordRetriever = WordRetriever.instance;
 
async function wordRetreive(word: string): Promise<WordDictionaryData[]> {
    let words: WordDictionaryData[];
    words = await wordRetriever.getWordsWithDefinitions(word);
    return words;
}
 
export class GenerateWords {
    private _finalGrid: Grid;

    constructor() {
        process.on('unhandledRejection', (reason, p) => {
            console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
            // application specific logging, throwing an error, or other logic here
        });
        // this._grid = await this.generateGrid();
    }

    public async generateGrid(): Promise<Grid> {
        while(1) {
            const grid: Grid = new Grid();
            if(await this.addWord(0, grid) === true) {
                return this._finalGrid;
            }
        }
        
        return null;
    }
 
    // alterner quand la longueur est pareille?
    //trouver meilleur nom de variable
    private async addWord(index: number, grid: Grid): Promise<boolean> {
        if(index === grid.Words.length) {
            this._finalGrid = grid;
            return true;
        }
        console.log(grid.Words.length - index);
        let words: WordDictionaryData[] = await wordRetreive(grid.Words[index].Text);
        if (words.length > 0) {
            if (grid.Words[index].Text.indexOf("?") === -1 && words[0].word !== grid.Words[index].Text) {
                return false;
            }
            words = words.filter(function(wordInfo) {
                return grid.Words.map((w) => w.Text).indexOf(wordInfo.word) === -1;
            });
            // words = this.shuffle(words);
        }
        for (let i = 0; i < words.length; i++) {
            let gridClone: Grid = Object.assign( Object.create( Object.getPrototypeOf(grid)), grid)
            if(!grid.Words[index].trySetData(words[i])) {
                continue;
            }
            if (await this.addWord(index + 1, gridClone) === true) {
                return true;
            }
        }
        return false;
    }

    /* private shuffle(a: Array<WordDictionaryData>) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    } */
}