import { Request, Response, NextFunction } from "express";
import { GridData } from "../../../common/communication/message";
import { Grid } from "./crossword/grid/grid";
import { WordsInventory } from "./crossword/grid/wordsInventory";
import "reflect-metadata";
import { injectable, } from "inversify";
import { GridCache } from "../cache/crosswordGridCache";

module Route {

    @injectable()
    export class CrosswordHandler {
        public getGrid(req: Request, res: Response, next: NextFunction): void {
            const grid: Grid = new Grid();
            grid.makeGrid();
            const words: WordsInventory = new WordsInventory(grid);
            words.createListOfWord();
            const gridData: GridData = { blackCells: [], wordInfos: [] };
            gridData.blackCells = grid.BlackSquares;
            for (const word of words.ListOfWord) {

                gridData.wordInfos.push({ direction: word.Direction, x: word.PosX, y: word.PosY, length: word.Length, definition: "definition"});
            }
            GridCache.Instance.addGrid({...gridData, words:[]});
            res.send(JSON.stringify(gridData));
        }

        public validateWord(req: Request, res: Response, next: NextFunction): void {
            let words: string[] = GridCache.Instance.getWords(req.body.gridId);
            res.send(words[req.body.wordIndex] === req.body.word);
        }
    }
}

export = Route;
