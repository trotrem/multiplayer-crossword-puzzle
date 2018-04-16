export enum FoundStatus {
    NOT,
    OPPONENT,
    PLAYER,
    BOTH
}

export interface Cell {
    isBlack: boolean;
    content: string;
    selected: boolean;
    letterFound: FoundStatus;
}
