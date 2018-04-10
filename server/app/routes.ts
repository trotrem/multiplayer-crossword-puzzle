import { injectable } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import { Racing } from "./racing/routes";

@injectable()
export class Routes {
    private racing: Racing;

    public constructor() {
        this.racing = new Racing();
    }

    public get routes(): Router {
        const router: Router = Router();

        router.post("/racing/track", (req: Request, res: Response, next: NextFunction) => this.racing.savetrack(req, res, next));

        router.get("/racing/admin", (req: Request, res: Response, next: NextFunction) => this.racing.getAlltracks(req, res, next));

        router.delete("/racing/deleteTrack/:name", (req: Request, res: Response, next: NextFunction) =>
            this.racing.deleteTrack(req, res, next));

        router.get("/racing/findOne/:name", (req: Request, res: Response, next: NextFunction) =>
            this.racing.getTrackByName(req, res, next));

        router.put("/racing/updateNewScores", (req: Request, res: Response, next: NextFunction) =>
            this.racing.updateScoresByName(req, res, next));

        return router;
    }
}
