export interface IPoint {
    x: number;
    y: number;
}

export enum Direction {
    Vertical,
    Horizontal
}

export interface IWordValidationParameters {
    gridId: number;
    word: string;
    wordIndex: number;
}

export type Difficulty = "easy" | "medium" | "hard";

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

export interface IGridData {
    id: number;
    blackCells: Array<IPoint>;
    wordInfos: Array<IWordInfo>;
}

export type Event = "connect" | "disconnect" | "message";
