import { ResultsManager } from "./results-manager";
import { IBestScores, INewScores } from "../../../../../../../common/communication/interfaces";

describe("ResultsManager", () => {
  it("should create an instance", () => {
    expect(new ResultsManager()).toBeTruthy();
  });
  // "magic numbers" utilisés pour les tests
/* tslint:disable:no-magic-numbers no-floating-promises */
  it("should return a sorted array of bestScores", () => {

    const bestScores: IBestScores[] = new Array <IBestScores>();
    bestScores.push({name: "", score: 2});
    bestScores.push({name: "", score: 0});
    bestScores.push({name: "", score: 1});
    const bestScoresNotSorted: IBestScores[] = new Array <IBestScores>();
    bestScoresNotSorted.push({name: "", score: 2});
    bestScoresNotSorted.push({name: "", score: 0});
    bestScoresNotSorted.push({name: "", score: 1});
    ResultsManager.bestScoresSort(bestScores);
    expect(bestScores === bestScoresNotSorted).toBeFalsy();
  });
  it("should calculate the human best score", () => {

    const scores: INewScores[] = new Array <INewScores>();
    scores.push({id: 0, scores: new Array<number>()});
    scores.push({id: 1, scores: new Array<number>()});
    scores[0].scores.push(3);
    scores[0].scores.push(3);
    scores[0].scores.push(3);
    scores[1].scores.push(2);
    scores[1].scores.push(2);
    scores[1].scores.push(2);
    const bestScore: IBestScores = {name: "Amal", score : 0};
    ResultsManager.calculateHumanScore(scores, bestScore) ;
    expect(bestScore.score).toBe(9);
  });
});
