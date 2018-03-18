import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { GridCache } from "../cache/crosswordGridCache";
import { GenerateWords } from "../../models/crossword/grid/generateWords";
import {  Difficulty } from "../../../common/communication/types";
import { IGrid } from "../../models/crossword/grid/dataStructures";
import { Document } from "mongoose";
import { CrosswordDocument } from "../../models/crosswordDbSchemas";
import { Utils } from "../../utils";

module Route {

    @injectable()
    export class CrosswordHandler {

        public getGrid(req: Request, res: Response, next: NextFunction): void {
            let newGrid: Promise<IGrid> = this.generateGrid(req.params.difficulty);
            CrosswordDocument.find({difficulty: req.params.difficulty}, async (err: Error, allGrids: Document[]): Promise<void> => {
                if (!err && allGrids.length > 0) {console.warn("find all");
                    let fetchedGrid: Document = allGrids[Utils.randomIntFromInterval(0, allGrids.length - 1)];
                    res.send(GridCache.Instance.addGrid(fetchedGrid["grid"]));
                    this.saveGrid(await newGrid, req.params.difficulty, fetchedGrid._id);
                } else {
                    console.error("unable to find all");
                    res.send(GridCache.Instance.addGrid(await newGrid));
                    this.saveGrid(await newGrid, req.params.difficulty, null);
                }
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

        private async generateGrid(difficulty: Difficulty): Promise<IGrid> {
            const gen: GenerateWords = new GenerateWords();
            return await gen.generateGrid();
        }

        private saveGrid(grid: IGrid, difficulty: Difficulty, overwriteId: number): void {
            let newGrid: Document = new CrosswordDocument({grid, difficulty});
            newGrid.save()
            .then((item: Document) => {
                console.warn("Created and saved new grid");
                CrosswordDocument.count({difficulty: difficulty}).exec((err: Error, count: number) => {
                    if (count > 10) {
                        if(overwriteId !== null) {
                            CrosswordDocument.deleteOne({_id: overwriteId})
                            .then(() => {
                                console.warn("Deleted fetched grid");
                            })
                            .catch((err: Error) => {
                                console.warn("Unable to delete from database");
                            });;
                        } else {
                            CrosswordDocument.deleteOne({difficulty: difficulty})
                            .skip(Utils.randomIntFromInterval(0, count - 1))
                            .then(() => {
                                console.warn("Deleted random grid");
                            })
                            .catch((err: Error) => {
                                console.warn("Unable to delete from database");
                            });;
                        }
                    }
                });
            })
            .catch((err: Error) => {
                console.warn("Unable to save to database");
            });
        }
    }
}

export = Route;
