import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { Index } from "./routes/index";
import { tracks } from "./db";
import { Document } from "mongoose";
const BAD_REQUEST_ERROR: number = 400;
@injectable()
export class Routes {
    public constructor(@inject(Types.Index) private index: Index) {

    }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => this.index.helloWorld(req, res, next));
        router.post("/track", (req: Request, res: Response, next: NextFunction) => {
            const myData: Document = new tracks(req.body);
            // console.log(req.body);

            myData.save()
                .then((item: Document) => {
                    res.send("Name saved to database");
                })
                .catch((err: Error) => {
                    res.status(BAD_REQUEST_ERROR).send("Unable to save to database");
                });
        });

        return router;
    }
}
