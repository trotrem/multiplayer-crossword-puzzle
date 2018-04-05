import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { trackDocument } from "../models/racingDbSchemas";
import { Document } from "mongoose";
const BAD_REQUEST_ERROR: number = 400;

module Route {

    @injectable()
    export class Racing {

        public savetrack(req: Request, res: Response, next: NextFunction): void {
            const myData: Document = new trackDocument(req.body);
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
            trackDocument.find({}, function (err: Error, allTracks: Document[]): void {
                if (!err) {
                    console.warn("find all");
                    res.send(allTracks);
                } else {
                    console.error("unable to find all");

                }
            });
        }

        public deleteTrack(req: Request, res: Response, next: NextFunction): void {
            // tslint:disable-next-line:only-arrow-functions
            trackDocument.remove({ name: req.params.name }, function (err: Error): void {
                if (!err) {
                    console.warn("delete one");
                    res.send("track delete");
                } else {
                    res.status(BAD_REQUEST_ERROR).send("unable to delete");
                }
            });
        }

        public getTrackByName(req: Request, res: Response, next: NextFunction): void {
            // tslint:disable-next-line:only-arrow-functions
            trackDocument.find({ name: req.params.name }, function (err: Error, track: Document): void {
                if (!err) {
                    console.warn("find ");
                    res.send(track);
                } else {
                    console.error("unable to find ");

                }
            });
        }

        public updateScoresByName(req: Request, res: Response, next: NextFunction): void {
            trackDocument.update(
                {name: req.body.name },
                { $set: {  newScores: req.body.newScores, usesNumber: req.body.usesNumber , bestScores: req.body.bestScores} },
                // tslint:disable-next-line:only-arrow-functions
                function (err: Error): void {
                    if (!err) {
                        console.warn("update ");
                        res.send("update newScores");
                    } else {
                        console.error("unable to update");
                        res.status(BAD_REQUEST_ERROR).send("unable to update");

                    }
                });
        }
        public updateBestScoreByName(req: Request, res: Response, next: NextFunction): void {
            trackDocument.update(
                {name: req.body.name },
                { $set: {  bestScores: req.body.bestScores } },
                // tslint:disable-next-line:only-arrow-functions
                function (err: Error): void {
                    if (!err) {
                        console.warn("update ");
                        res.send("update bestScore");
                    } else {
                        console.error("unable to update");
                        res.status(BAD_REQUEST_ERROR).send("unable to update");

                    }
                });
            }
    }
}

export = Route;
