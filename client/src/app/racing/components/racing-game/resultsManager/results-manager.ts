import { INewScores, IBestScores } from "../../../../../../../common/communication/interfaces";

export class ResultsManager {

public static calculateHumanScore(scores: INewScores[], bestScore: IBestScores): void {
    for (const sc of scores[0].scoresCar) {
      bestScore.scorePlayer += sc;
    }
  }

public static bestScoresSort(bestScores: IBestScores[]): void {
    bestScores = bestScores.sort((n1, n2) => {
      return n1.scorePlayer - n2.scorePlayer ;
    });
  }
}
