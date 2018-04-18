import { ResultsManager } from "./results-manager";
import { IBestScores, INewScores } from "../../../../../../../common/communication/interfaces";

/* tslint:disable:no-magic-numbers*/
describe("ResultsManager", () => {
    it("should create an instance", () => {
        expect(new ResultsManager()).toBeTruthy();
    });
    it("should return a sorted array of bestScores", () => {

        const bestScores: IBestScores[] = new Array<IBestScores>();
        bestScores.push({ namePlayer: "", scorePlayer: 2 });
        bestScores.push({ namePlayer: "", scorePlayer: 0 });
        bestScores.push({ namePlayer: "", scorePlayer: 1 });
        const bestScoresNotSorted: IBestScores[] = new Array<IBestScores>();
        bestScoresNotSorted.push({ namePlayer: "", scorePlayer: 2 });
        bestScoresNotSorted.push({ namePlayer: "", scorePlayer: 0 });
        bestScoresNotSorted.push({ namePlayer: "", scorePlayer: 1 });
        ResultsManager.bestScoresSort(bestScores);
        expect(bestScores === bestScoresNotSorted).toBeFalsy();
    });
    it("should calculate the human best score", () => {

        const scores: INewScores[] = new Array<INewScores>();
        scores.push({ idCar: 0, scoresCar: new Array<number>() });
        scores.push({ idCar: 1, scoresCar: new Array<number>() });
        scores[0].scoresCar.push(3);
        scores[0].scoresCar.push(3);
        scores[0].scoresCar.push(3);
        scores[1].scoresCar.push(2);
        scores[1].scoresCar.push(2);
        scores[1].scoresCar.push(2);
        const bestScore: IBestScores = { namePlayer: "Amal", scorePlayer: 0 };
        ResultsManager.calculateHumanScore(scores, bestScore);
        expect(bestScore.scorePlayer).toBe(9);
    });
});
