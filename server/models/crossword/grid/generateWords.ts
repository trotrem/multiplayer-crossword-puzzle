/* import { Words } from "./words";
import { Grid } from "./grid";
import { Word, Direction } from "./word";
import { WordRetriever } from "../lexiconAPI/wordRetriever";
import { GridWordInformation } from "../lexiconAPI/gridWordInformation";

const wordRetriever: WordRetriever = WordRetriever.instance;

async function wordRetreive(word: string): Promise<GridWordInformation[]> {
    let words: GridWordInformation[];
    words = await wordRetriever.getWordsWithDefinitions("hall");
    return words;
}

export class GenerateWords {

    private _grid: Grid;
    private _wordsList = new Words(this._grid);
    private _wordsListSorted = this._wordsList.ListOfWord.sort((word1, word2) => {
        const length1 = word1.Length;
        const length2 = word2.Length;
        if (length1 > length2) { return -1; }
        if (length1 < length2) { return 1; }
        return 0;
    });

    constructor() {

    }
    generateGrid(): void {
        this._grid = new Grid(); //generation d'une nouvelle grille
        let workingWord = this._wordsListSorted[0]; // working word est le mot qui est travailler
        this.addWord(workingWord, 0); //add le premier mot
    }

    // alterner quand la longueur est pareille?
    //trouver meilleur nom de variable
    addWord(newWord: Word, index: number): boolean {
        let words: GridWordInformation[];
        let wordNext: Word = this._wordsListSorted[index + 1];
        // add newWord to grid and sortedList
        this._wordsListSorted[index] = newWord;
        //remplir la grille avec d'autre lettres
        this.gridFilling(newWord);
        this.refactorSortedList;
        //on chercher le tableau du prochain mot
        wordRetreive(this._wordsListSorted[index + 1].Word.word)
            .then(
            (function (found) {
                words = found;
            }),
            (function (reject) {
                //aucun mot trouvé ?
                return false;
            }));
        //add si return fonction
        for (let i = 0; i < words.length; i++) {
            wordNext.setWord(words[i]);
            this.addWord(wordNext,index+1);
        }
        // if done -> DONE return true
        // let prochainsPossibles = ...
        // if reject return false
        // foreach prochain{
        //  addWord(grid, LeMot)
        // }
        return false;
    }

    //ajoute le mot dans la grille
    private gridFilling(fillingWord: Word): void {
        for (let letter = 0; letter < fillingWord.Length; letter++) {
            if (fillingWord.Direction == Direction.X) {
                this._grid.Grid[fillingWord.PosX + letter][fillingWord.PosY].setLetter(fillingWord.Word.word[letter])//arranger le Word.word....
            } else if (fillingWord.Direction == Direction.X) {
                this._grid.Grid[fillingWord.PosX][fillingWord.PosY + letter].setLetter(fillingWord.Word.word[letter])
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
        }
    }
}
 */