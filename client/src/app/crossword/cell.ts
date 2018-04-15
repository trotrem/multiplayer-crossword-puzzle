export enum FoundStatus {
    NOT,
    OPPONENT,
    PLAYER
}

export interface Cell {
    isBlack: boolean;
    content: string;
    selected: boolean;
    letterFound: FoundStatus;
}
