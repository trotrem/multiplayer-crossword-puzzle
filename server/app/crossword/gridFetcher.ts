import { GenerateWords } from "./models/grid/generateWords";
import { Difficulty } from "../../../common/communication/types";
import { IGrid } from "./models/grid/dataStructures";
import { Document } from "mongoose";
import { crosswordDocument } from "./models/crosswordDbSchemas";
import { Utils } from "../utils";
// TODO: create import index
const MAX_SAME_DIFFICULTY_DB_GRIDS: number = 10;

namespace Route {
    export class GridFetcher {
        public static async fetchGrid(difficulty: Difficulty, gridFetchedCallback: (g: IGrid) => {}): Promise<void> {
            const newGrid: Promise<IGrid> = GenerateWords.generateGrid(difficulty);

            return crosswordDocument.find({ difficulty: difficulty }).then(
                async (allGrids: Document[]): Promise<void> => {
                    if (allGrids.length === 0) {
                        throw "no grids found";
                    }
                    const fetchedGrid: Document =
                        allGrids[Utils.randomIntFromInterval(0, allGrids.length - 1)];

                    gridFetchedCallback(fetchedGrid["grid"]);

                    console.warn("fetched grids");
                    if ((await newGrid) !== null) {
                        this.saveGrid(await newGrid, difficulty, fetchedGrid._id);
                    }
                }).catch(async () => {
                    console.error("unable to fetch grids");
                    if ((await newGrid) !== null) {
                        this.saveGrid(await newGrid, difficulty, null);
                    }

                    gridFetchedCallback(await newGrid);
                });
        }

        private static saveGrid(grid: IGrid, difficulty: Difficulty, overwriteId: number): void {
            const newGrid: Document = new crosswordDocument({ grid, difficulty });
            newGrid
                .save()
                .then(async (item: Document) => {
                    console.warn("Created and saved new grid");
                    if (overwriteId !== null && await this.shouldDeleteGrid(difficulty)) {
                        this.deleteGrid(difficulty, overwriteId);
                    }
                })
                .catch((err: Error) => {
                    console.warn("Unable to save to database");
                });
        }

        private static async shouldDeleteGrid(difficulty: Difficulty): Promise<boolean> {
            return crosswordDocument
                .count({ difficulty: difficulty })
                .then((count: number) => {
                    return count > MAX_SAME_DIFFICULTY_DB_GRIDS;
                })
                .catch(() => false);
        }

        private static deleteGrid(difficulty: Difficulty, overwriteId: number): void {
            crosswordDocument
                .deleteOne({ _id: overwriteId })
                .then(() => {
                    console.warn("Deleted fetched grid");
                })
                .catch(() => {
                    console.warn("Unable to delete from database");
                });
        }
    }
}

export = Route;
