import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable } from "inversify";
import { GridCache } from "../cache/crosswordGridCache";
import { GenerateWords } from "../../models/crossword/grid/generateWords";
import { Difficulty } from "../../../common/communication/types";
import { IGrid } from "../../models/crossword/grid/dataStructures";
import { Document } from "mongoose";
import { CrosswordDocument } from "../../models/crosswordDbSchemas";
import { Utils } from "../../utils";

const MAX_SAME_DIFFICULTY_DB_GRIDS: number = 10;

namespace Route {
  @injectable()
  export class CrosswordHandler {
    public getGrid(req: Request, res: Response, next: NextFunction): void {
      const newGrid: Promise<IGrid> = this.generateGrid(req.params.difficulty);
      CrosswordDocument.find(
        { difficulty: req.params.difficulty },
        async (err: Error, allGrids: Document[]): Promise<void> => {
          if (!err && allGrids.length > 0) {
            console.warn("fetched grids");
            const fetchedGrid: Document =
              allGrids[Utils.randomIntFromInterval(0, allGrids.length - 1)];
            res.send(GridCache.Instance.addGrid(fetchedGrid["grid"]));
            this.saveGrid(
              await newGrid,
              req.params.difficulty,
              fetchedGrid._id
            );
          } else {
            console.error("unable to fetch grids");
            res.send(GridCache.Instance.addGrid(await newGrid));
            this.saveGrid(await newGrid, req.params.difficulty, null);
          }
        }
      );
    }

    public validateWord(req: Request, res: Response, next: NextFunction): void {
      const words: string[] = GridCache.Instance.getWords(req.body.gridId);
      if (
        words.length > req.body.wordIndex &&
        JSON.stringify(words[0] === req.body.word)
      ) {
        GridCache.Instance.validateWord(req.body.gridId, req.body.wordIndex);
        res.send(true);
      } else {
        res.send(false);
      }
    }

    public getCheatModeWords(
      req: Request,
      res: Response,
      next: NextFunction
    ): void {
      res.send(GridCache.Instance.getWords(req.params.gridId));
    }

    private async generateGrid(difficulty: Difficulty): Promise<IGrid> {
      const gen: GenerateWords = new GenerateWords();

      return gen.generateGrid();
    }

    private saveGrid(
      grid: IGrid,
      difficulty: Difficulty,
      overwriteId: number
    ): void {
      const newGrid: Document = new CrosswordDocument({ grid, difficulty });
      newGrid
        .save()
        .then((item: Document) => {
          console.warn("Created and saved new grid");
          if (this.shouldDeleteGrid(difficulty)) {
            this.deleteGrid(difficulty, overwriteId);
          }
        })
        .catch((err: Error) => {
          console.warn("Unable to save to database");
        });
    }

    private async shouldDeleteGrid(difficulty: Difficulty): Promise<boolean> {
      return CrosswordDocument.count({ difficulty: difficulty }).then(
        (count: number) => {
          return count > MAX_SAME_DIFFICULTY_DB_GRIDS;
        }
      ).catch(
          () => false
      );
    }

    private deleteGrid(difficulty: Difficulty, overwriteId: number): void {
      if (overwriteId !== null) {
        CrosswordDocument.deleteOne({ _id: overwriteId })
          .then(() => {
            console.warn("Deleted fetched grid");
          })
          .catch(() => {
            console.warn("Unable to delete from database");
          });
      } else {
        CrosswordDocument.deleteOne({ difficulty: difficulty })
          .skip(
            Utils.randomIntFromInterval(0, MAX_SAME_DIFFICULTY_DB_GRIDS - 1)
          )
          .then(() => {
            console.warn("Deleted random grid");
          })
          .catch(() => {
            console.warn("Unable to delete from database");
          });
      }
    }
  }
}

export = Route;
