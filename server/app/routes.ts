import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { Index } from "./routes/index";
import { CrosswordHandler } from "./routes/crossword";

import { Racing } from "./routes/racing";
@injectable()
export class Routes {
    private racing: Racing;

    private crossword: CrosswordHandler
    public constructor(@inject(Types.Index) private index: Index) {
        this.crossword = new CrosswordHandler();
            this.racing = new Racing();
    }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => this.index.helloWorld(req, res, next));

        router.post("/track", (req: Request, res: Response, next: NextFunction) => this.racing.savetrack(req, res, next));

        router.get("/admin", (req: Request, res: Response, next: NextFunction) => this.racing.getAlltracks(req, res, next));
        
        router.get("/crossword-grid", (req: Request, res: Response, next: NextFunction) => { this.crossword.getGrid(req, res, next); });

        router.get("/crossword-grid/easy", (req: Request, res: Response, next: NextFunction) => { this.crossword.getEasyGrid(req, res, next); });

        router.get("/crossword-grid/medium", (req: Request, res: Response, next: NextFunction) => { this.crossword.getMediumGrid(req, res, next); });

        router.get("/crossword-grid/hard", (req: Request, res: Response, next: NextFunction) => { this.crossword.getHardGrid(req, res, next); });

        router.delete("/:name/deleteTrack", (req: Request, res: Response, next: NextFunction) => this.racing.deleteTrack(req, res, next));

        router.get("/:name", (req: Request, res: Response, next: NextFunction) => this.racing.getTrackByName(req, res, next));

        return router;
    }
}
