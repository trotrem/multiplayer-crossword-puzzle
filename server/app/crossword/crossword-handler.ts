import { injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { CrosswordGamesCache } from "./cache/crosswordGridCache";
import { IValidationWord } from "./dataStructures";

namespace Route {
    @injectable()
    // TODO renommer
    export class CrosswordHandler {

        public getCheatModeWords(req: Request, res: Response, next: NextFunction): void {
            res.send(CrosswordGamesCache.Instance.getWords(req.params.gridId).map((w: IValidationWord) => w.word));
          }
    }
}
export = Route;