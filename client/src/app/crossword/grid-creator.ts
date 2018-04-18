import { Direction, IPoint, IWordInfo } from "./../../../../common/communication/types";
import { GridEventService } from "./grid-event.service/grid-event.service";
import { IGridData } from "./../../../../common/communication/events";
import { WordDescription, AssociatedPlayers, Cell } from "./dataStructures";

export class GridCreator {
    public static createGrid(
        gridData: IGridData,
        gridEventService: GridEventService,
        words: WordDescription[],
        nbPlayers: number,
        cells: Cell[][]): Cell[][] {

        gridEventService.initialize(words, gridData.gameId);
        gridData.blackCells.forEach((cell: IPoint) => {
            cells[cell.y][cell.x].isBlack = true;
        });

        return cells;
    }
    public static fillWords(gridData: IGridData, filledCells: Cell[][], words: WordDescription[]): WordDescription[] {
        gridData.wordInfos.forEach((word: IWordInfo, index: number) => {
            const cells: Cell[] = new Array<Cell>();
            for (let i: number = 0; i < word.length; i++) {
                if (word.direction === Direction.Horizontal) {
                    cells.push(filledCells[word.y][word.x + i]);
                } else if (word.direction === Direction.Vertical) {
                    cells.push(filledCells[word.y + i][word.x]);
                }
            }
            words.push({
                id: index,
                direction: word.direction,
                cells: cells,
                definition: word.definition,
                found: AssociatedPlayers.NONE
            });
        });

        return words;
    }

}
