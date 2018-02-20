interface Point {
    x: number;
    y: number;
}

interface WordInfo {
    direction: string;
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