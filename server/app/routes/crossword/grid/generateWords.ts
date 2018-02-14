import { Words } from "./words";
import { Grid } from "./grid";
import { Word, Direction } from "./word";
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
    private _wordsList: Words;
    private _wordsListSorted = new Array<Word>();

    constructor() {
        this._grid = new Grid();
        this._grid.makeGrid();
        this._wordsList = new Words(this._grid);
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

    public async generateGrid(): Promise<Grid> {
        let words: GridWordInformation[] = new Array<GridWordInformation>();
        let workingWord = this._wordsListSorted[0]; // working word est le mot qui est travailler
        words = await wordRetreive(this._wordsListSorted[0].GridWord.word);
        for (let i = 0; i < words.length; i++) {
            workingWord.setWord(words[i]);
            if (this.addWord(workingWord, 0))
                return this._grid;
        }
        return null;
        /*return await wordRetreive(this._wordsListSorted[0].GridWord.word)
            .then(
            ((found) => {
                words = found;
                console.log("oui");
                for (let i = 0; i < words.length; i++) {
                    workingWord.setWord(words[i]);
                    this.addWord(workingWord, 0);
                }
                return this._grid;
            }),
            ((reject) => {
                //aucun mot trouvé ?
                console.log("non");
                return null;
            }));*/
    }


    // alterner quand la longueur est pareille?
    //trouver meilleur nom de variable
    private async addWord(newWord: Word, index: number): Promise<boolean> {
        let inGrid: boolean = false;
        let words: GridWordInformation[];
        let wordNext: Word = this._wordsListSorted[index + 1];
        // add newWord to grid and sortedList
        this._wordsListSorted[index] = newWord;
        for (let a = 0; a < this._wordsListSorted.length; a++) {
            console.log(this._wordsListSorted[a].GridWord.word);
        }
        //remplir la grille avec d'autre lettres
        this.gridFilling(newWord);
        this.refactorSortedList;
        //on chercher le tableau du prochain mot
        console.log(index);
        words = await wordRetreive(wordNext.GridWord.word);
        for (let i = 0; i < words.length; i++) {
            inGrid = false;
            wordNext.setWord(words[i]);
            for (let j = 0; j < index; j++) {
                if (words[i].word == this._wordsListSorted[j].GridWord.word) {
                    inGrid = true;
                    console.log("boucle");
                }
            }
            if (!inGrid) {
                console.log(wordNext.GridWord.word);
                if (this.addWord(wordNext, index + 1)) {
                    return true;
                }
            }
        }
        return false;
        /*return await wordRetreive(wordNext.GridWord.word)
            .then(
            ( (found) => {
                console.log("found add");
                words = found;
                for (let i = 0; i < words.length; i++) {
                    wordNext.setWord(words[i]);
                    this.addWord(wordNext, index + 1);
                }
                return true;
            }),
            ( (reject) => {
                //aucun mot trouvé ?
                console.log("not found add");
                return false;
            }));*/
        //add si return fonction
        // if done -> DONE return true
        // let prochainsPossibles = ...
        // if reject return false
        // foreach prochain{
        //  addWord(grid, LeMot)
        // }
    }

    //ajoute le mot dans la grille
    private gridFilling(fillingWord: Word): void {
        for (let letter = 0; letter < fillingWord.Length; letter++) {
            if (fillingWord.Direction == Direction.Y) {
                this._grid.Grid[fillingWord.PosX + letter][fillingWord.PosY].setLetter(fillingWord.GridWord.word[letter])//arranger le Word.word....
            } else if (fillingWord.Direction == Direction.X) {
                this._grid.Grid[fillingWord.PosX][fillingWord.PosY + letter].setLetter(fillingWord.GridWord.word[letter])
            }
        }
    }

    //refactor tous les mots qui doivent encore etre changer (plus bas que le nouveau mot ajouté)
    private refactorSortedList(index: number) {
        let wordRefactored: Word;
        let newLetters: string = null;
        let newGridWord: GridWordInformation;
        for (let i = index; i < this._wordsListSorted.length; i++) {
            wordRefactored = this._wordsListSorted[i];
            for (let letter = 0; letter < wordRefactored.Length; letter++) {
                if (wordRefactored.Direction == Direction.X) {
                    newLetters += this._grid[wordRefactored.PosX + i][wordRefactored.PosY];
                } else if (wordRefactored.Direction == Direction.Y) {
                    newLetters += this._grid[wordRefactored.PosX][wordRefactored.PosY + i];
                }
            }
            newGridWord.setWord(newLetters);
            wordRefactored.setWord(newGridWord);
            console.log(wordRefactored.GridWord.word);
        }
    }
}
