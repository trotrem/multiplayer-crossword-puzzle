export class Square {
    private id: number;
    private isBlack: boolean;
    private letter: string;

    constructor(id: number, isBlack: boolean, letter: string) {
        this.id = id;
        this.isBlack = isBlack;
        this.letter = letter;
    }

    public setId(id: number): void {
        this.id = id;
    }
    public setIsBlack(isBlack: boolean): void {
        this.isBlack = isBlack;
    }
    public setLetter(letter: string): void {
        this.letter = letter;
    }
    public getId(): number {
        return this.id;
    }
    public getIsBlack(): boolean {
        return this.isBlack;
    }
    public getLetter(): string {
        return this.letter;
    }
}
