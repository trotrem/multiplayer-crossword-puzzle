import { Request, Response, NextFunction } from "express";
import { GridData, Difficulty } from "../../../common/communication/types";
import { Word } from "../../models/crossword/grid/word";
import "reflect-metadata";
import { injectable, } from "inversify";
import { GridCache } from "../cache/crosswordGridCache";
import { PlaceholderGrid } from "../../models/crossword/placeholders/placeholderGrids";

module Route {

    @injectable()
    export class CrosswordHandler {
        public getGrid(req: Request, res: Response, next: NextFunction): void {
            const placeholderGrid: PlaceholderGrid = new PlaceholderGrid(req.params.difficulty as Difficulty);
            const gridData: GridData = { id: 0, blackCells: [], wordInfos: [] };
            gridData.blackCells = placeholderGrid.Grid.BlackSquares;
            placeholderGrid.WordList.ListOfWord.forEach((word: Word, index: number) => {
                gridData.wordInfos.push({ id: index,
                                          direction: word.Direction,
                                          x: word.PosX,
                                          y: word.PosY,
                                          length: word.Length,
                                          definition: word.GridWord.definitions[0]});
            });
            res.send(GridCache.Instance.addGrid(gridData,
                                                placeholderGrid.WordList.ListOfWord.map(
                                                     (wordInfo: Word): string => wordInfo.GridWord.word)));
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
