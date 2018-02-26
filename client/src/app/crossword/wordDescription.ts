import {Cell} from "./cell";
import { Direction } from "../../../../common/communication/message";

export interface WordDescription {
    id: number;
    direction: Direction;
    cells: Cell[];
    definition: string;
    word?: string;
}
