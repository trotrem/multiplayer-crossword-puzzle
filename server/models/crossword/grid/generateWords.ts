import { GridLayoutHandler } from "./gridLayoutHandler";
import { WordsPositionsHelper } from "./wordsPositionsHelper";
import { GridUtils } from "./wordsUtils";
import { WordRetriever } from "../lexiconAPI/wordRetriever";
import { WordDictionaryData } from "../lexiconAPI/gridWordInformation";
import { IGrid, IWordContainer } from "./dataStructures";
import { Utils } from "../../../utils";
 
const wordRetriever: WordRetriever = WordRetriever.instance;
 
async function wordRetrieve(word: string): Promise<WordDictionaryData[]> {
    let words: WordDictionaryData[];
    words = await wordRetriever.getWordsWithDefinitions(word);
    return words;
}
 
export class GenerateWords {
    private _layoutHandler: GridLayoutHandler;

    public async generateGrid(): Promise<IGrid> {
        this._layoutHandler = new GridLayoutHandler();
        while(1) {
            let grid: IGrid = {cells:[], words: [], blackCells: []};
            this._layoutHandler.makeGrid(grid);
            WordsPositionsHelper.createListOfWord(grid);
            let result: IGrid = await this.addWord(0, grid);
            if(result !== null) {
                return result;
            }
        }
        
        return null;
    }
 
    private async addWord(index: number, grid: IGrid): Promise<IGrid> {
        if(index === grid.words.length) {
            return grid;
        }
        let currentText: string = GridUtils.getText(grid.words[index], grid);
        let words: WordDictionaryData[] = await wordRetrieve(currentText);
        if (words.length > 0) {
            words = words.filter((wordInfo) => {
                return grid.words.map((w: IWordContainer) => GridUtils.getText(w, grid)).indexOf(wordInfo.word) === -1;
            });
        }
        for (let i = 0; i < Math.min(10, words.length); i++) {
            if(GridUtils.trySetData(words[Utils.randomIntFromInterval(0, words.length - 1)], grid.words[index], grid)) {
                let nextStep: IGrid = await this.addWord(index + 1, grid);
                if(nextStep !== null) {
                    return nextStep;
                }
                break;
            }
        }

        return null;
    }
}