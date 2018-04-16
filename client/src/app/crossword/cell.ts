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
