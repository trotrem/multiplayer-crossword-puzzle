// tslint-disable
// disabled tslint since this class is only there as a temporary measure to make features that need a filled grid work

import { Grid } from "../grid/grid";
import { WordsInventory } from "../grid/wordsInventory";
import { GridWordInformation } from "../lexiconAPI/gridWordInformation";
import { Direction, Difficulty } from "../../../../common/communication/message";

export class PlaceholderGrid {
    protected _grid: Grid = new Grid();
    protected wordsList: WordsInventory;

    constructor(difficulty: Difficulty) {
        if (difficulty === "easy") {
            this.fillEasyGrid();
        } else if (difficulty === "medium") {
            this.fillEasyGrid();
        } else if (difficulty === "hard") {
            this.fillEasyGrid();
        }
    }

    public get Grid(): Grid {
        return this._grid;
    }
    public get WordList(): WordsInventory {
        return this.wordsList;
    }

    private fillEasyGrid(): void {
        this._grid.Grid[0][6].setIsBlack(true);
        this._grid.Grid[1][1].setIsBlack(true);
        this._grid.Grid[1][2].setIsBlack(true);
        this._grid.Grid[1][4].setIsBlack(true);
        this._grid.Grid[2][6].setIsBlack(true);
        this._grid.Grid[3][4].setIsBlack(true);
        this._grid.Grid[3][9].setIsBlack(true);
        this._grid.Grid[4][5].setIsBlack(true);
        this._grid.Grid[4][7].setIsBlack(true);
        this._grid.Grid[4][8].setIsBlack(true);
        this._grid.Grid[4][9].setIsBlack(true);
        this._grid.Grid[5][0].setIsBlack(true);
        this._grid.Grid[5][1].setIsBlack(true);
        this._grid.Grid[5][2].setIsBlack(true);
        this._grid.Grid[5][4].setIsBlack(true);
        this._grid.Grid[6][0].setIsBlack(true);
        this._grid.Grid[6][5].setIsBlack(true);
        this._grid.Grid[7][3].setIsBlack(true);
        this._grid.Grid[8][5].setIsBlack(true);
        this._grid.Grid[8][7].setIsBlack(true);
        this._grid.Grid[8][8].setIsBlack(true);
        this._grid.Grid[9][3].setIsBlack(true);

        this.fillEasyWords();
        this.gridFilling();
    }

    private fillEasyWords(): void {
        this.wordsList = new WordsInventory(this._grid);
        this.wordsList.createListOfWord();
        this.wordsList.ListOfWord[0].setWord(new GridWordInformation("STOPS", ["Halts"], 0));
        this.wordsList.ListOfWord[1].setWord(new GridWordInformation("BEY", ["Turkish governor"], 0));
        this.wordsList.ListOfWord[2].setWord(new GridWordInformation("RUT", ["Groove"], 0));
        this.wordsList.ListOfWord[3].setWord(new GridWordInformation("RULE", ["Govern"], 0));
        this.wordsList.ListOfWord[4].setWord(new GridWordInformation("ACE", ["Top card"], 0));
        this.wordsList.ListOfWord[5].setWord(new GridWordInformation("ODDS", ["Probability"], 0));
        this.wordsList.ListOfWord[6].setWord(new GridWordInformation("INTERIM", ["Meantime"], 0));
        this.wordsList.ListOfWord[7].setWord(new GridWordInformation("ECRU", ["Unbleached linen"], 0));
        this.wordsList.ListOfWord[8].setWord(new GridWordInformation("EARN", ["Deserve"], 0));
        this.wordsList.ListOfWord[9].setWord(new GridWordInformation("ELEGANT", ["Refined and luxirous"], 0));
        this.wordsList.ListOfWord[10].setWord(new GridWordInformation("MODE", ["Fashion"], 0));
        this.wordsList.ListOfWord[11].setWord(new GridWordInformation("RAT", ["Rodent"], 0));
        this.wordsList.ListOfWord[12].setWord(new GridWordInformation("ARID", ["Parched"], 0));
        this.wordsList.ListOfWord[13].setWord(new GridWordInformation("EVE", ["First woman"], 0));
        this.wordsList.ListOfWord[14].setWord(new GridWordInformation("PEN", ["Female swan"], 0));
        this.wordsList.ListOfWord[15].setWord(new GridWordInformation("TERMS", ["Teaching periods"], 0));
        this.wordsList.ListOfWord[16].setWord(new GridWordInformation("SHRINE", ["Hallowed place"], 0));
        this.wordsList.ListOfWord[17].setWord(new GridWordInformation("MAP", ["Travel guide"], 0));
        this.wordsList.ListOfWord[18].setWord(new GridWordInformation("ADORE", ["Worship"], 0));
        this.wordsList.ListOfWord[19].setWord(new GridWordInformation("ORATOR", ["Public speaker"], 0));
        this.wordsList.ListOfWord[20].setWord(new GridWordInformation("DIN", ["Clamour"], 0));
        this.wordsList.ListOfWord[21].setWord(new GridWordInformation("PUCE", ["Brownish-purple"], 0));
        this.wordsList.ListOfWord[22].setWord(new GridWordInformation("NEED", ["Require"], 0));
        this.wordsList.ListOfWord[23].setWord(new GridWordInformation("STERN", ["Part of a ship"], 0));
        this.wordsList.ListOfWord[24].setWord(new GridWordInformation("BERET", ["Headwear"], 0));
        this.wordsList.ListOfWord[25].setWord(new GridWordInformation("ROME", ["Eternal city"], 0));
        this.wordsList.ListOfWord[26].setWord(new GridWordInformation("GAVE", ["Donated"], 0));
        this.wordsList.ListOfWord[27].setWord(new GridWordInformation("BUD", ["Rudimentary shoot"], 0));
        this.wordsList.ListOfWord[28].setWord(new GridWordInformation("CRATER", ["Mouth of a volcano"], 0));
        this.wordsList.ListOfWord[29].setWord(new GridWordInformation("ELDER", ["Church office holder"], 0));
        this.wordsList.ListOfWord[30].setWord(new GridWordInformation("YES", ["Acceptance"], 0));
        this.wordsList.ListOfWord[31].setWord(new GridWordInformation("UTTERS", ["Speaks"], 0));
    };
    
    private gridFilling(): void {
        for (const fillingWord of this.wordsList.ListOfWord) {
            for (let letter: number = 0; letter < fillingWord.Length; letter++) {
                if (fillingWord.Direction === Direction.Vertical) {
                    this._grid.Grid[fillingWord.PosY + letter][fillingWord.PosX].setLetter(fillingWord.GridWord.word[letter]);
                } else if (fillingWord.Direction === Direction.Horizontal) {
                    this._grid.Grid[fillingWord.PosY][fillingWord.PosX + letter].setLetter(fillingWord.GridWord.word[letter]);
                }
            }
        }
    }
}
