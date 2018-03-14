import { GridLayoutHandler } from "./gridLayoutHandler";
import { WordRetriever } from "../lexiconAPI/wordRetriever";
import { WordDictionaryData } from "../lexiconAPI/gridWordInformation";
import { IGrid, IWordContainer } from "./dataStructures";
import { WordsInventory } from "./wordsInventory";
 
const wordRetriever: WordRetriever = WordRetriever.instance;
 
async function wordRetreive(word: string): Promise<WordDictionaryData[]> {
    let words: WordDictionaryData[];
    words = await wordRetriever.getWordsWithDefinitions(word);
    return words;
}
 
export class GenerateWords {
    private _layoutHandler: GridLayoutHandler;
    private _wordsManager: WordsInventory;

    constructor() {
        process.on('unhandledRejection', (reason, p) => {
            console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
            // application specific logging, throwing an error, or other logic here
        });
        // this._grid = await this.generateGrid();
    }

    public async generateGrid(): Promise<IGrid> {
        this._layoutHandler = new GridLayoutHandler();
        this._wordsManager = new WordsInventory();
        while(1) {
            let grid: IGrid = {cells:[], words: [], blackCells: []};
            this._layoutHandler.makeGrid(grid);
            this._wordsManager.createListOfWord(grid);
            console.log("yo");
            let result: IGrid = await this.addWord(0, grid);
            if(result !== null) {
                return result;
            }
        }
        
        return null;
    }
 
    // alterner quand la longueur est pareille?
    //trouver meilleur nom de variable
    private async addWord(index: number, grid: IGrid): Promise<IGrid> {
        if(index === grid.words.length) {
            return grid;
        }
        console.log(grid.words.length - index);
        let currentText: string = this._wordsManager.Text(grid.words[index], grid);
        let words: WordDictionaryData[] = await wordRetreive(currentText);
        if (words.length > 0) {
            if (currentText.indexOf("?") === -1 && words[0].word !== currentText) {
                
                return null;
            }
            words = words.filter((wordInfo) => {
                return grid.words.map((w: IWordContainer) => this._wordsManager.Text(w, grid)).indexOf(wordInfo.word) === -1;
            });
            words = this.shuffle(words);
        }
        for (let i = 0; i < Math.min(10, words.length); i++) {
            if (this._wordsManager.trySetData(words[i], grid.words[index], grid)) {
                let nextStep: IGrid = await this.addWord(index + 1, grid);
                if(nextStep !== null) {
                    return nextStep;
                }

                return null;
            }
        }

        return null;
    }

    private shuffle(a: Array<WordDictionaryData>) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
}