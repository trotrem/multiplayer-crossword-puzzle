export class Word{
    private length :number;
    private number : number;
    private text : string;
    //private constraints ;
    constructor(length :number, number : number, text: string){
        this.length = length;
        this.number = number;
        this.text = text;
    }

    public getWord (){
        return this.text;
    }
    public getLength(){
        return this.length;
    }
    public getNumber(){
        return this.getNumber;
    }
    public setWord(word : string){
        this.text = word;
    }


}