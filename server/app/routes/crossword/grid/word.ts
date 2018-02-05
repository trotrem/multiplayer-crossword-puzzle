export class Word {
    private length: number;
    private num: number;
    private text: string;

    constructor(length: number, num: number, text: string) {
        this.length = length;
        this.num = num;
        this.text = text;
    }

    public getWord(): string {
        return this.text;
    }
    public getLength(): number {
        return this.length;
    }
    public getNumber(): number {
        return this.num;
    }
    public setWord(word: string): void {
        this.text = word;
    }
}
