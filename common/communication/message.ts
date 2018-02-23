export interface Point {
    x: number;
    y: number;
}

export enum Direction {
    Vertical,
    Horizontal
}

export interface WordInfo {
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

export class GridData {
    public blackCells: Array<Point>;
    public wordInfos: Array<WordInfo>;
}