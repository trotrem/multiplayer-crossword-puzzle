import { Square } from "./square";
import { Word } from "./word"

const WIDTH = 10;
const HEIGHT = 10;

function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
export class Grid {

    private grid: Square[][];
    private blackSquares: number[];
    private notBlackSquares: number[] = [1,11,21,31,41,51,61,71,81,91,10,12,13,14,15,16,17,18,
                                        19,8,28,38,48,58,68,78,88,98,80,82,83,84,85,86,87,89];
    private listOfWord : Word[];
    private listOfWordH : Word[];

    constructor() {

    }

    private generateBlackSquare(): void {

        let nbrBlack = randomIntFromInterval(11, 15);
        for (let index = 0; index < nbrBlack; index++) {
            let temp = randomIntFromInterval(0, 99);
            for(let verif2 = 0; verif2<this.notBlackSquares.length; verif2++) {
                if (temp === this.notBlackSquares[verif2]){
                    temp = randomIntFromInterval(0,99);
                    verif2 =0;
                }else{
                    for (let verif1 = 0; verif1 < this.blackSquares.length; verif1++) {
                        if (temp === this.blackSquares[verif1]) {
                        temp = randomIntFromInterval(0, 99);
                        verif1 = 0;
                        verif2 = 0;
                        }   
                    }
                }
            }
//a voir pour meilleur (try catch??)
        if(temp%10 > 0)
            this.notBlackSquares.push(temp-1);
        if(temp%10 < 9)
            this.notBlackSquares.push(temp+1);
        if(temp > 9)
            this.notBlackSquares.push(temp+10);
        if(temp < 90) 
            this.notBlackSquares.push(temp-10);

            this.notBlackSquares.push(temp-2);
            this.notBlackSquares.push(temp+2);
            this.notBlackSquares.push(temp-20);
            this.notBlackSquares.push(temp+20);

            this.blackSquares[index] = temp;
        }

    }


    private makeGrid(): void {
        //making an empty grid
        for (let indexI = 0; indexI < WIDTH; indexI++) {
            for (let indexJ = 0; indexJ < HEIGHT; indexJ++) {
                this.grid[indexI][indexJ] = new Square(indexI*10+indexJ,false,null);    
            }
        }
        //putting black square in the grid
        for(let index = 0; index < this.blackSquares.length; index++){
            let indexTemp = this.blackSquares[index];
            let indexITemp = indexTemp%10;
            let indexJTemp = Math.ceil(indexTemp/10);
            this.grid[indexITemp][indexJTemp].setIsBlack(true);
        }
    }

    private createListOfWord() : void{
        

    }
    private putWords(): void {
        
    }

}
