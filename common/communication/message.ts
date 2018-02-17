interface Point {
    x: number;
    y: number;
}

export class Message {
    public title: string;
    public body: string;
}

export class GridData {
    public blackCells: Array<Point>
}