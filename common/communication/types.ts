export interface IPoint {
    x: number;
    y: number;
}

export enum Direction {
    Vertical,
    Horizontal
}

export interface IWordValidationParameters {
    gridId: string;
    word: string;
    wordIndex: number;
}

export enum Difficulty {
    Easy,
    Medium,
    Hard
}

export enum NbPlayers {
    One = 1,
    Two = 2
}

export interface IWordInfo {
    id: number;
    direction: Direction;
    x: number;
    y: number;
    length: number;
    definition: string;
}

export class Message {
    public title: string;
    public body: string;
}

export interface ICrosswordSettings {
    difficulty: Difficulty;
    nbPlayers: number;
    playerName?: string;
}

