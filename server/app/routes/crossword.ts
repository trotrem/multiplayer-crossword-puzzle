import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { GridCache } from "../cache/crosswordGridCache";
import { GenerateWords } from "../../models/crossword/grid/generateWords";
import { IWordInfo } from "../../../common/communication/types";
import { IWordContainer } from "../../models/crossword/grid/dataStructures";

module Route {

    @injectable()
    export class CrosswordHandler {

        public getGrid(req: Request, res: Response, next: NextFunction): void {
            const gen: GenerateWords = new GenerateWords();
            gen.generateGrid().then((grid) => {
                const sortedWords = grid.words.sort((w1: IWordContainer, w2: IWordContainer) => w1.id - w2.id);
                res.send(GridCache.Instance.addGrid({id: 0, blackCells: grid.blackCells, wordInfos: sortedWords.map(
                    (word: IWordContainer): IWordInfo => {return {id: word.id, 
                                                                  direction: word.direction, 
                                                                  x: word.gridSquares[0].x, 
                                                                  y: word.gridSquares[0].y, 
                                                                  definition: word.data.definitions[0], 
                                                                  length: word.gridSquares.length}})}
                , sortedWords.map((w: IWordContainer) => w.gridSquares.map((s) => grid.cells[s.x][s.y].letter).join("").toUpperCase())));
            });
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
