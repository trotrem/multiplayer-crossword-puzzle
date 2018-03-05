import { WordsInventory } from "./wordsInventory";
import { Grid } from "./grid";
import { Word } from "./word";
import { WordRetriever } from "../lexiconAPI/wordRetriever";
import { GridWordInformation } from "../lexiconAPI/gridWordInformation";
 
const wordRetriever: WordRetriever = WordRetriever.instance;
 
async function wordRetreive(word: string): Promise<GridWordInformation[]> {
    let words: GridWordInformation[];
    words = await wordRetriever.getWordsWithDefinitions(word);
    return words;
}
 
export class GenerateWords {
 
    private _grid: Grid;
    private _wordsList: WordsInventory;
    private _wordsListSorted = new Array<Word>();
 
    constructor() {
        this._grid = new Grid();
        this._wordsList = new WordsInventory(this._grid);
        this._wordsList.createListOfWord();
        this._wordsListSorted = this._wordsList.ListOfWord.sort((word1, word2) => {
            const length1 = word1.Length;
            const length2 = word2.Length;
            if (length1 > length2) { return -1; }
            if (length1 < length2) { return 1; }
            return 0;
        });
        process.on('unhandledRejection', (reason, p) => {
            console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
            // application specific logging, throwing an error, or other logic here
        });
        // this._grid = await this.generateGrid();
    }
    public get Grid(): Grid {
        return this._grid;
    }

    public get WordsList(): WordsInventory {
        return this._wordsList;
    }
 
    public async generateGrid(): Promise<Grid> {
        let workingWords: string[] = new Array<string>();
        for (let i = 0; i < this._wordsListSorted.length; i++) {
            workingWords.push(this._wordsListSorted[i].GridWord.word);
        }

        let words: GridWordInformation[] = await wordRetreive(this._wordsListSorted[0].GridWord.word);
        for (let i = 0; i < words.length; i++) {
            this._wordsListSorted[0].setWord(words[i]);
            workingWords[0] = this._wordsListSorted[0].GridWord.word;
            this.refactorWords(0, workingWords);
            if (await this.addWord(1, workingWords.slice()))
                return this._grid;
        }
        return null;
    }
 
 
    // add newWord to grid
        // if done -> DONE return true
        // let prochainsPossibles = ...
        // if reject return false
        // foreach prochain{
        //  addWord(grid, LeMot)
        // 

    // alterner quand la longueur est pareille?
    //trouver meilleur nom de variable
    private async addWord(index: number, filledWords: string[]): Promise<boolean> {
        if(index === filledWords.length) {
            return true;
        }
        console.log(filledWords.length - index);
        let words: GridWordInformation[] = await wordRetreive(filledWords[index]);
        for (let i = 0; i < words.length; i++) {
            this._wordsListSorted[index].setWord(words[i]);
            filledWords[index] = words[i].word;
            this.refactorWords(index, filledWords);
            if (await this.addWord(index + 1, filledWords.slice())) {
                return true;
            }
        }
        return false;
    }
 
    // TODO: modifier une liste temporaire
    //refactor tous les mots qui doivent encore etre changer (plus bas que le nouveau mot ajouté)
    private refactorWords(index: number, words: string[]) {
        for(let i = index + 1; i < this._wordsListSorted.length; i++) {
            const j: number = this._wordsListSorted[i].crossingIndexOf(this._wordsListSorted[index]);
            if(j !== -1) {
                const char: string = words[index][this._wordsListSorted[index].crossingIndexOf(this._wordsListSorted[i])];
                words[i] = words[i].substr(0, j) + char + words[i].substr(j + 1);
            }
        }
    }
}