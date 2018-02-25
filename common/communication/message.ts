export interface Point {
    x: number;
    y: number;
}

export enum Direction {
    Vertical,
    Horizontal
}

export interface WordInfo {
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

export interface GridData {
    id: number;
    blackCells: Array<Point>;
    wordInfos: Array<WordInfo>;
}