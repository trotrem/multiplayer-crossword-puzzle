import { Injectable } from "@angular/core";
import { CommunicationService } from "./communication.service";
import { WordDescription } from "./wordDescription";
import { Direction } from "../../../../common/communication/types";

enum TipMode {
  Definitions,
  Cheat
}

@Injectable()
export class GridModeService {
  private communicationService: CommunicationService;
  private TipMode: typeof TipMode = TipMode;
  public tipMode: TipMode = TipMode.Definitions;
  private words: WordDescription[];

  public constructor(communicationService: CommunicationService, words: WordDescription[] ) {
    this.communicationService = communicationService;
    this.words = words;
   }

  public get horizontalWords(): WordDescription[] {
    return this.words.filter((word) => word.direction === Direction.Horizontal);
  }

  public get verticalWords(): WordDescription[] {
    return this.words.filter((word) => word.direction === Direction.Vertical);
  }

  public toggleTipMode(): void {
    if (this.horizontalWords[0].word === undefined) {
      this.fetchCheatModeWords();
    }
    this.tipMode === TipMode.Definitions ? this.tipMode = TipMode.Cheat : this.tipMode = TipMode.Definitions;
  }

  private fetchCheatModeWords(): void {
    this.communicationService.fetchCheatModeWords(this.id)
      .subscribe((data: string[]) => {
        const words: string[] = data as string[];
        let i: number = 0;
        for (const word of this.horizontalWords.concat(this.verticalWords)) {
          word.word = words[i];
          i++;
        }
      });
  }
}
