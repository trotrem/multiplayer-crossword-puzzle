export class Word{
    private length :number;
    private text : string;
    //private constraints ;
    constructor(length :number, text: string){
        this.length = length;
        this.text = text;
    }

    public getWord (){
        return this.text;
    }
    public getLength(){
        return this.length;
    }
    public setWord(){
        return this.setWord;
    }


}