export class Square {
    id : number;
    isBlack : boolean;
    letter: string;
    canBeBlack : boolean;
    name : string;
    
    constructor(id_ : number, isBlack_ : boolean, letter_ : string, canBeBlack_ : boolean){
        this.id = id_;
        this.isBlack = isBlack_;
        this.letter = letter_;
        this.canBeBlack = canBeBlack_;
        this.name = "Sarah";
    }
}