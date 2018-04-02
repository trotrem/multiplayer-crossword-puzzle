import { injectable } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

//TODO: rename crossword route file (and racing)
import { CrosswordHandler } from "./crossword/routes";

import { Racing } from "./racing/routes";

@injectable()
export class Routes {
    private racing: Racing;
    private crossword: CrosswordHandler;

    public constructor() {
        this.crossword = new CrosswordHandler();
        this.racing = new Racing();
    }

    public get routes(): Router {
        const router: Router = Router();

        router.post("/racing/track", (req: Request, res: Response, next: NextFunction) => this.racing.savetrack(req, res, next));

        router.get("/racing/admin", (req: Request, res: Response, next: NextFunction) => this.racing.getAlltracks(req, res, next));

        router.get("/crossword/grid/:difficulty", (req: Request, res: Response, next: NextFunction) =>
            this.crossword.getGrid(req, res, next));

        router.get("/crossword/cheatwords/:gridId", (req: Request, res: Response, next: NextFunction) =>
            this.crossword.getCheatModeWords(req, res, next));

        router.post("/crossword/validate", (req: Request, res: Response, next: NextFunction) =>
            this.crossword.validateWord(req, res, next));

        router.delete("/racing/deleteTrack/:name", (req: Request, res: Response, next: NextFunction) =>
            this.racing.deleteTrack(req, res, next));

        router.get("/racing/findOne/:name", (req: Request, res: Response, next: NextFunction) =>
            this.racing.getTrackByName(req, res, next));

        router.put("/racing/updateNewScores", (req: Request, res: Response, next: NextFunction) =>
            this.racing.updateScoresByName(req, res, next));

        return router;
    }
}
