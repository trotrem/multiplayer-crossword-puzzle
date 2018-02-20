import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { tracks } from "./../db";
import { Document } from "mongoose";
const BAD_REQUEST_ERROR: number = 400;

module Route {

    @injectable()
    export class Racing {

        public savetrack(req: Request, res: Response, next: NextFunction): void{
            const myData: Document = new tracks(req.body);
            // tslint:disable-next-line:only-arrow-functions
            tracks.remove({ name: req.body.name }, function(err: Error): void {
                if (!err) {
                        console.warn("delete");
                } else {
                        console.error("erreur dans delete");
                }
            });
            myData.save()
                .then((item: Document) => {
                    res.send("Name saved to database");
                })
                .catch((err: Error) => {
                    res.status(BAD_REQUEST_ERROR).send("Unable to save to database");
                });
        }
    }
}

export = Route;
