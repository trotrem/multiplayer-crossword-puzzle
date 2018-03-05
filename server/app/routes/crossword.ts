import { Request, Response, NextFunction } from "express";
import { IGridData, Difficulty, IWordInfo } from "../../../common/communication/types";
import { Word } from "../../models/crossword/grid/word";
import "reflect-metadata";
import { injectable, } from "inversify";
import { GridCache } from "../cache/crosswordGridCache";
import { Grid } from "../../models/crossword/grid/grid";
import { WordsInventory } from "../../models/crossword/grid/wordsInventory";

module Route {

    @injectable()
    export class CrosswordHandler {
        /* public getGrid(req: Request, res: Response, next: NextFunction): void {
            const placeholderGrid: PlaceholderGrid = new PlaceholderGrid(req.params.difficulty as Difficulty);
            const gridData: IGridData = this.fillGridData(placeholderGrid);
            res.send(GridCache.Instance.addGrid(gridData, placeholderGrid.Words.map((x: Word): string => x.GridWord.word)));
        }

        private fillGridData(grid: PlaceholderGrid): IGridData {
            const gridData: IGridData = { id: 0, blackCells: [], wordInfos: [] };
            gridData.blackCells = grid.BlackSquares;
            grid.Words.forEach((word: Word, index: number) => {
                gridData.wordInfos.push({ id: index,
                                          direction: word.Direction,
                                          x: word.PosX,
                                          y: word.PosY,
                                          length: word.Length,
                                          definition: word.GridWord.definitions[0]});
            });

            return gridData;
        } */

        public getGrid(req: Request, res: Response, next: NextFunction): void {
            const grid: Grid = new Grid();
            grid.makeGrid();
            const words: WordsInventory = new WordsInventory(grid);
            words.createListOfWord();
            const gridData: IGridData = {id: 0, blackCells: grid.BlackSquares, wordInfos: words.ListOfWord.map((word): IWordInfo => {return {id: word.Number, direction: word.Direction, x: word.PosX, y: word.PosY, definition: "", length: word.Length}})};

            res.send(GridCache.Instance.addGrid(gridData, []));
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
