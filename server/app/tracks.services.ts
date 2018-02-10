import { Request, Response, NextFunction } from "express";
import { injectable } from 'inversify';
let tracks = require("./db");
let Promises = require("mongoose");
import {track} from "../../common/communication/track";

/*
 * Provides suggestions for cities depending on a search term
 * 
 * Path supported:
 * - /api/suggestions?q=someText
 * - /api/suggestions?q=someText&latitude=41&longitude=64
 */
export interface ItracksServices {
    getServiceTrack(req: Request, res: Response, next: NextFunction): void;
}

@injectable()
export class tracksServices implements ItracksServices {
    
    public getServiceTrack(req: Request, res: Response, next: NextFunction) {
        let q = req.query['q'];
        if (q === undefined) {
            res.status(400);
            res.json({ suggestions: [] })
        }

        let latitude = req.query['latitude'];
        let longitude = req.query['longitude'];

        tracks.find({
            $text : {
                $search : q
            }
        })
        .then((results: any[]) => {
            let tracks: track[] = new Array();
            for (let result of results) {
                tracks.push(<track> {
                    
                });
            }
        })
        .catch((reason: any)=>{
            console.log(reason);
            res.send(500);
        });
    }
