import { Request, Response, NextFunction } from "express";
//import { Message } from "../../../common/communication/message";
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
            tracks.remove({ name: req.body.name }, function(err) {
                if (!err) {
                        console.log("delete");
                }
                else {
                        console.log("erreur dans delete");
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
