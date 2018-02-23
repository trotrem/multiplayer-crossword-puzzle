import {Cell} from "./cell"
import { Direction } from "../../../../common/communication/message"

export interface WordDescription {
    direction: Direction;
    cells: Cell[];
    definition: string;
  }