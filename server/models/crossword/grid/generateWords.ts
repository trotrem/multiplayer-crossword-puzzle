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
 
    private _grid: Grid;
 
    constructor() {
        this._grid = new Grid();
        process.on('unhandledRejection', (reason, p) => {
            console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
            // application specific logging, throwing an error, or other logic here
        });
        // this._grid = await this.generateGrid();
    }
    public get Grid(): Grid {
        return this._grid;
    }

    public async generateGrid(): Promise<void> {
        let words: WordDictionaryData[] = await wordRetreive(this._grid.Words[0].Text);
        for (let i = 0; i < words.length; i++) {
            this._grid.Words[0].trySetData(words[i]);
            await this.addWord(1, this._grid);
        }
    }
 
    // alterner quand la longueur est pareille?
    //trouver meilleur nom de variable
    private async addWord(index: number, grid: Grid): Promise<boolean> {
        if(index === grid.Words.length) {
            return true;
        }
        let words: WordDictionaryData[] = await wordRetreive(grid.Words[index].Text);
        if (words.length > 0) {
            words = words.filter(function(wordInfo) {
                return grid.Words.map((w) => w.Text).indexOf(wordInfo.word) === -1;
            });
            words = this.shuffle(words);
        }
        console.log(grid.Words.map((w) => w.Text));
        console.log(index);
        for (let i = 0; i < words.length; i++) {
            let gridClone: Grid = Object.assign( Object.create( Object.getPrototypeOf(grid)), grid)
            this._grid.Words[index].setData(words[i]);
            if(!grid.Words[index].trySetData(words[i])) {
                break;
            }
            if (await this.addWord(index + 1, gridClone)) {
                return true;
            }
        }
        return false;
    }

    private shuffle(a: Array<WordDictionaryData>) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
}