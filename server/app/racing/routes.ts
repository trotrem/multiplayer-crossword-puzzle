import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { trackDocument } from "../racing/models/racingDbSchemas";
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
            trackDocument.find({}, (err: Error, allTracks: Document[]): void => {
                if (!err) {
                    console.warn("find all");
                    res.send(allTracks);
                } else {
                    console.error("unable to find all");

                }
            });
        }

        public deleteTrack(req: Request, res: Response, next: NextFunction): void {
            trackDocument.remove({ name: req.params.name }, (err: Error): void => {
                if (!err) {
                    console.warn("delete one");
                    res.send("track delete");
                } else {
                    res.status(BAD_REQUEST_ERROR).send("unable to delete");
                }
            });
        }

        public getTrackByName(req: Request, res: Response, next: NextFunction): void {
            trackDocument.find({ name: req.params.name }, (err: Error, track: Document): void => {
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
                { name: req.body.name },
                { $set: { INewScores: req.body.INewScores, usesNumber: req.body.usesNumber, IBestScores: req.body.IBestScores } },
                (err: Error): void => {
                    if (!err) {
                        console.warn("update ");
                        res.send("update INewScores");
                    } else {
                        console.error("unable to update");
                        res.status(BAD_REQUEST_ERROR).send("unable to update");

                    }
                });
        }
    }
}

export = Route;
