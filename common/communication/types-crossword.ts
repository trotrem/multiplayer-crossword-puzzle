export enum Direction {
    Vertical,
    Horizontal
}

export enum Difficulty {
    Easy,
    Medium,
    Hard
}

export enum GameResult {
    Victory,
    Defeat,
    Tie
}

export enum NbPlayers {
    One = 1,
    Two = 2
}

export interface IPoint {
    x: number;
    y: number;
}

export interface IWordInfo {
    id: number;
    direction: Direction;
    x: number;
    y: number;
    length: number;
    definition: string;
}
