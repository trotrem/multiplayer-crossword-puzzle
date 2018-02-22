import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { tracks } from "./../db";
import { Document} from "mongoose";
const BAD_REQUEST_ERROR: number = 400;

module Route {

    @injectable()
    export class Racing {

        public savetrack(req: Request, res: Response, next: NextFunction): void {
            const myData: Document = new tracks(req.body);
            // tslint:disable-next-line:only-arrow-functions
            tracks.remove({ name: req.body.name }, function (err: Error): void {
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

        public getAlltracks(req: Request, res: Response, next: NextFunction): void {
            // tslint:disable-next-line:only-arrow-functions
            tracks.find({}, function (err: Error, allTracks: Document[]): void {
                if (!err) {
                    console.warn("find all");
                    res.send(allTracks);
                } else {
                    console.error("erreur dans find all");

                }
            });
        }

        public deleteTrack(req: Request, res: Response, next: NextFunction): void {
            console.warn(req.params.name);
            // tslint:disable-next-line:only-arrow-functions
            tracks.remove({ name: req.params.name }, function (err: Error): void {
                if (!err) {
                    console.warn("delete");
                    res.send("track delete");
                } else {
                    res.status(BAD_REQUEST_ERROR).send("erreur dans delete");
                }
            });
        }
    }
}

export = Route;
