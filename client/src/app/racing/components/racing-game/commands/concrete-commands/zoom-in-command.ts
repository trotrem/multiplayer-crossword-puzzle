import { ICommand } from "../command";
import { RenderGameService } from "../../render-game-service/render-game.service";

export class ZoomInCommand implements ICommand {

    public constructor(private renderService: RenderGameService) {
    }

    public execute(): void {
        this.renderService.zoomIn();
    }
}
