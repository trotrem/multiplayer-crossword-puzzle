import { ICommand } from "../command";
import { RenderService } from "../../render-service/render.service";

export class SwitchCameraCommand implements ICommand {

    public constructor(private renderService: RenderService) {
    }

    public execute(): void {
        this.renderService.toggleCamera();
    }
}
