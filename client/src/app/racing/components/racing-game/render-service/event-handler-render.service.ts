// Maniere d'utiliser moins d'import peut etre?
import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import * as Command from "../commands/concrete-commands/headers";
import * as KeyCode from "../commands/key-code";
import { KeyUp, KeyDown } from "../commands/key-press";
import { RenderService } from "./render.service";

@Injectable()
export class EventHandlerRenderService {

    public constructor(car: Car, renderService: RenderService) {
        this.initCommands(car, renderService);
    }

    public initCommands(car: Car, renderService: RenderService): void {
        // Key down commands
        KeyDown.Instance.addCommand(KeyCode.ACCELERATE_KEYCODE, new Command.AccelerationCommand(car));
        KeyDown.Instance.addCommand(KeyCode.LEFT_KEYCODE, new Command.SteerLeftCommand(car));
        KeyDown.Instance.addCommand(KeyCode.RIGHT_KEYCODE, new Command.SteerRightCommand(car));
        KeyDown.Instance.addCommand(KeyCode.BRAKE_KEYCODE, new Command.BrakeCommand(car));
        KeyDown.Instance.addCommand(KeyCode.ZOOM_IN_KEYCODE, new Command.ZoomInCommand(renderService));
        KeyDown.Instance.addCommand(KeyCode.ZOOM_OUT_KEYCODE, new Command.ZoomOutCommand(renderService));
        KeyDown.Instance.addCommand(KeyCode.SWITCH_CAMERA_KEYCODE, new Command.SwitchCameraCommand(renderService));
        // Key up commands
        KeyUp.Instance.addCommand(KeyCode.LEFT_KEYCODE, new Command.ReleaseSteerCommand(car));
        KeyUp.Instance.addCommand(KeyCode.RIGHT_KEYCODE, new Command.ReleaseSteerCommand(car));
        KeyUp.Instance.addCommand(KeyCode.ACCELERATE_KEYCODE, new Command.DecelerateCommand(car));
        KeyUp.Instance.addCommand(KeyCode.BRAKE_KEYCODE, new Command.ReleaseBrakesCommand(car));
    }

}
