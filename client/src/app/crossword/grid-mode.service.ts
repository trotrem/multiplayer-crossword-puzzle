import { Injectable } from "@angular/core";
import { CommunicationService } from "./communication.service";

enum TipMode {
  Definitions,
  Cheat
}

@Injectable()
export class GridModeService {
  private communicationService: CommunicationService;
  private TipMode: typeof TipMode = TipMode;
  public tipMode: TipMode = TipMode.Definitions;

  constructor() { }

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
