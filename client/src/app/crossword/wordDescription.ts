import {Cell} from "./cell";
import { Direction } from "../../../../common/communication/types";

export interface WordDescription {
    id: number;
    direction: Direction;
    cells: Cell[];
    definition: string;
    word?: string;
    // TODO: devrait appeler found à la place? Ca fait bizarre word.wordFound
    wordFound: boolean;
}
