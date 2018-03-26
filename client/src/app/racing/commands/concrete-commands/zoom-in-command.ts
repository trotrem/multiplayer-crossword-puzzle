import { ICommand } from "../command";
import { RenderService } from "../../render-service/render.service";

export class ZoomInCommand implements ICommand {

    public constructor(private renderService: RenderService) {
    }

    public execute(): void {
        this.renderService.zoomIn();
    }
}
