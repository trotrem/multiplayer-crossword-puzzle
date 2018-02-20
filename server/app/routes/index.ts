import { Request, Response, NextFunction } from "express";
import { Message, GridData } from "../../../common/communication/message";
import { Grid } from "./crossword/grid/grid";
import "reflect-metadata";
import { injectable, } from "inversify";

module Route {

    @injectable()
    export class Index {

        public helloWorld(req: Request, res: Response, next: NextFunction): void {
            const message: Message = new Message();
            message.title = "Hello";
            message.body = "World";
            res.send(JSON.stringify(message));
        }

        public getGrid(req: Request, res: Response, next: NextFunction): void {
            const grid: Grid = new Grid();
            grid.makeGrid();
            const gridData: GridData = { blackCells: [] };
            gridData.blackCells = grid.BlackSquares;
            res.send(JSON.stringify(gridData));
        }
    }
}

export = Route;
