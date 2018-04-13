import { INewScores, IBestScores } from "../../../../../../../common/communication/interfaces";

export class ResultsManager {

public static calculateHumanScore(scores: INewScores[], bestScore: IBestScores): void {
    for (const sc of scores[0].scores) {
      bestScore.score += sc;
    }
  }

public static bestScoresSort(bestScores: IBestScores[]): void {
    bestScores = bestScores.sort((n1, n2) => {
      return n1.score - n2.score ;
    });
  }
}
