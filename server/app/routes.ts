import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { Index } from "./routes/index";
import { CrosswordHandler } from "./routes/crossword";

@injectable()
export class Routes {

    private crossword: CrosswordHandler
    public constructor(@inject(Types.Index) private index: Index) {
        this.crossword = new CrosswordHandler();
    }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/",
                   (req: Request, res: Response, next: NextFunction) => this.index.helloWorld(req, res, next));

        router.get("/crossword-grid", (req: Request, res: Response, next: NextFunction) => { this.crossword.getGrid(req, res, next); });

        return router;
    }
}
