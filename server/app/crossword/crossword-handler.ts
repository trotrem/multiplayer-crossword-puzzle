import { injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { GridCache } from "./cache/crosswordGridCache";

namespace Route {
    @injectable()
    export class CrosswordHandler {

        public getCheatModeWords(req: Request, res: Response, next: NextFunction): void {
            console.log("worked?: " + req.params.gridId)
            res.send(GridCache.Instance.getWords(req.params.gridId));
          }
    }
}
export = Route;