import { Cell, AssociatedPlayers} from "./cell";
import { Direction } from "../../../../common/communication/types";

export interface WordDescription {
    id: number;
    direction: Direction;
    cells: Cell[];
    definition: string;
    word?: string;
    found: AssociatedPlayers;
}
