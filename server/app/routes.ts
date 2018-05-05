import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import { CrosswordRoutes } from "./crossword/crossword-routes";
import Types from "./types";

@injectable()
export class Routes {

    public constructor(@inject(Types.CrosswordRoutes)private crossword: CrosswordRoutes) {   }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/crossword/cheatwords/:gridId", (req: Request, res: Response, next: NextFunction) =>
        this.crossword.getCheatModeWords(req, res, next));

        return router;
    }
}
