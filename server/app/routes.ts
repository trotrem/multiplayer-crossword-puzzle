import { injectable/*, inject */ } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

//import Types from "./types";
//import { Index } from "./routes/index";
import { tracks } from "./db";

@injectable()
export class Routes {
    //private dummy: any;
    public constructor(/*@inject(Types.Index) private index: Index*/) {
        /*this.dummy = {
            name: "Sibeesh",
            description: "Venu"
        }*/
    }


    public get routes(): Router {
        const router: Router = Router();

        /*router.get("/",
                   (req: Request, res: Response, next: NextFunction) => this.index.helloWorld(req, res, next));*/
        router.post("/track", (req: Request, res: Response, next: NextFunction) => {
            var myData = new tracks(req.body);
            console.log(req.body);
            myData.save()
                .then(item => {
                    res.send("Name saved to database");
                    console.log("Name saved to database");
                })
                .catch(err => {
                    res.status(400).send("Unable to save to database");
                    console.log("Unable to save to database");
                });
        });



        return router;
    }
}
