import { Direction } from "../../../../common/communication/types";

export enum AssociatedPlayers {
    NONE,
    OPPONENT,
    PLAYER,
    BOTH
}

export interface Cell {
    isBlack: boolean;
    content: string;
    selectedBy: AssociatedPlayers;
    letterFound: AssociatedPlayers;
}

export interface WordDescription {
    id: number;
    direction: Direction;
    cells: Cell[];
    definition: string;
    word?: string;
    found: AssociatedPlayers;
}

export interface SelectedWord {
    player: AssociatedPlayers;
    word: WordDescription;
}
