import { Request, Response, NextFunction } from "express";
import { GridData } from "../../../common/communication/message";
import { Grid } from "./crossword/grid/grid";
import { Word } from "./crossword/grid/word";
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
            const gridData: GridData = { id: 0, blackCells: [], wordInfos: [] };
            gridData.blackCells = grid.BlackSquares;
            words.ListOfWord.forEach((word: Word, index: number) => {
                gridData.wordInfos.push({ id: index,
                                          direction: word.Direction,
                                          x: word.PosX, y: word.PosY,
                                          length: word.Length,
                                          definition: "definition"});
            });
            res.send(GridCache.Instance.addGrid({gridData, words: ["TEST", "TEST", "TEST", "TEST", "TEST"]}));
        }

        public validateWord(req: Request, res: Response, next: NextFunction): void {
            const words: string[] = GridCache.Instance.getWords(req.body.gridId);
            if (words.length > req.body.wordIndex && JSON.stringify(words[0] === req.body.word)) {
                GridCache.Instance.validateWord(req.body.gridId, req.body.wordIndex);
                res.send(true);
            } else {
                res.send(false);
            }
        }

        public getCheatModeWords(req: Request, res: Response, next: NextFunction): void {
            res.send(GridCache.Instance.getWords(req.params.gridId));
        }
    }
}

export = Route;
