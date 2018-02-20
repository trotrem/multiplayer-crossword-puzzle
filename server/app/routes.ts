import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { Index } from "./routes/index";
import {Racing} from "./routes/racing";
@injectable()
export class Routes {

    private racing: Racing;
    public constructor(@inject(Types.Index) private index: Index) {
        this.racing = new Racing;
    }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => this.index.helloWorld(req, res, next));
        router.post("/track", (req: Request, res: Response, next: NextFunction) => this.racing.savetrack(req,res,next));

       // router.get("/admin", (req:Request,res:Response, nest: NextFunction) => {

       // });

        return router;
    }
}
