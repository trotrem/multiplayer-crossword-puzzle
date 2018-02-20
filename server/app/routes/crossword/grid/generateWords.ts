import { Words } from "./words";
import { Grid } from "./grid";
import { Word, Direction } from "./word";
import { WordRetriever } from "../lexiconAPI/wordRetriever";
import { GridWordInformation } from "../lexiconAPI/gridWordInformation";

const wordRetriever: WordRetriever = WordRetriever.instance;

export class GenerateWords {

    private _grid: Grid;
    private _wordsList: Words;
    private _wordsListSorted: Word[] = new Array<Word>();

    constructor() {
        this._grid = new Grid();
        this._grid.makeGrid();
        this._wordsList = new Words(this._grid);
        this._wordsList.createListOfWord();
        this._wordsListSorted = this._wordsList.ListOfWord.sort((word1: Word, word2: Word) => {
            const length1: number = word1.Length;
            const length2: number = word2.Length;
            if (length1 > length2) { return -1; }
            if (length1 < length2) { return 1; }

            return 0;
        });
        process.on("unhandledRejection", (reason, p) => {
            console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
            // application specific logging, throwing an error, or other logic here
        });
    }
    public get Grid(): Grid {
        return this._grid;
    }
    private async wordRetreive(word: string): Promise<GridWordInformation[]> {
        let words: GridWordInformation[];
        words = await wordRetriever.getWordsWithDefinitions(word);

        return words;
    }

    public async generateGrid(): Promise<Grid> {
        let words: GridWordInformation[] = new Array<GridWordInformation>();
        const workingWord: Word = this._wordsListSorted[0];
        words = await this.wordRetreive(this._wordsListSorted[0].GridWord.word);
        for (let i: number = 0; i < words.length; i++) {
            workingWord.setWord(words[i]);
            if (await this.addWord(workingWord, 0)) {

                return this._grid;
            }
        }

        return null;
    }

    private async addWord(newWord: Word, index: number): Promise<boolean> {
        if (index + 1 < this._wordsListSorted.length) {
            let inGrid: boolean = false;
            let words: GridWordInformation[];
            const wordNext: Word = this._wordsListSorted[index + 1];
            this._wordsListSorted[index] = newWord;
            this.gridFilling(newWord);
            this.refactorSortedList();

            for (let a: number = 0; a < this._wordsListSorted.length; a++) {
                console.log(this._wordsListSorted[a].GridWord.word);
            }

            words = await this.wordRetreive(wordNext.GridWord.word);
            for (let i: number = 0; i < words.length; i++) {
                inGrid = false;
                wordNext.setWord(words[i]);
                for (let j: number = 0; j < index; j++) {
                    if (words[i].word === this._wordsListSorted[j].GridWord.word) {
                        inGrid = true;
                    }
                }
                if (!inGrid) {
                    if (await this.addWord(wordNext, index + 1)) {

                        return true;
                    }
                }
            }

            return false;
        } else {

            return true;
        }
    }

    // ajoute le mot dans la grille
    private gridFilling(fillingWord: Word): void {
        for (let letter: number = 0; letter < fillingWord.Length; letter++) {
            if (fillingWord.Direction === Direction.Y) {
                this._grid.Grid[fillingWord.PosX + letter][fillingWord.PosY].setLetter(fillingWord.GridWord.word[letter]);
            } else if (fillingWord.Direction === Direction.X) {
                this._grid.Grid[fillingWord.PosX][fillingWord.PosY + letter].setLetter(fillingWord.GridWord.word[letter]);
            }
        }
    }

    private refactorSortedList(): void {
        let newLetters: string;
        for (let i: number = 0; i < this._wordsListSorted.length; i++) {
            newLetters = "";
            for (let letter: number = 0; letter < this._wordsListSorted[i].Length; letter++) {
                if (this._wordsListSorted[i].Direction === Direction.Y) {
                    newLetters += this._grid.Grid[this._wordsListSorted[i].PosX + letter][this._wordsListSorted[i].PosY].getLetter();
                } else if (this._wordsListSorted[i].Direction === Direction.X) {
                    newLetters += this._grid.Grid[this._wordsListSorted[i].PosX][this._wordsListSorted[i].PosY + letter].getLetter();
                }
            }
            this._wordsListSorted[i].GridWord.setWord(newLetters);
        }
    }
}
