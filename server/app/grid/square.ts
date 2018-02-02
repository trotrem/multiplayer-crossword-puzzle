export class Square {
    private id : number;
    private isBlack : boolean;
    private letter: string;
    //private canBeBlack : boolean;
    
    constructor(id_ : number, isBlack_ : boolean, letter_ : string, /*canBeBlack_ : boolean*/){
        this.id = id_;
        this.isBlack = isBlack_;
        this.letter = letter_;
        //this.canBeBlack = canBeBlack_;
    }
    
    public setId (id : number){
        this.id = id;
    }
    public setIsBlack (isBlack :boolean){
        this.isBlack = isBlack;
    }
    public setLetter (letter : string) :void {
        this.letter = letter;
    }
    /*public setCanBeBlack (canBeBlack : boolean){
        this.canBeBlack = canBeBlack;
    }*/

    public getId (){
        return this.id;
    }
    public getIsBlack(){
        return this.isBlack;
    }
    public getLetter(){
        return this.letter;
    }
    /*public getCanBeBlack(){
        return this.canBeBlack;
    }*/


    

}

