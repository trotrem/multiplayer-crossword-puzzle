import { ICommand } from "../command";
import { RenderGameService } from "../../render-game-service/render-game.service";

export class ZoomOutCommand implements ICommand {

    public constructor(private renderService: RenderGameService) {
    }

    public execute(): void {
        this.renderService.zoomOut();
    }
}
