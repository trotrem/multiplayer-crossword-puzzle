// Maniere d'utiliser moins d'import peut etre?
import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import * as Command from "../commands/concrete-commands/headers";
import * as KeyCode from "../commands/key-code";
import { Keyboard } from "../commands/keyboard";
import { RenderService } from "./render.service";

@Injectable()
export class EventHandlerRenderService {

    public constructor(car: Car, renderService: RenderService, private keyboard: Keyboard) {
        this.initCommands(car, renderService);
    }

    public initCommands(car: Car, renderService: RenderService): void {
        // Key down commands
        // Cars
        this.keyboard.addCommand(KeyCode.ACCELERATE_KEYCODE, new Command.AccelerationCommand(car));
        this.keyboard.addCommand(KeyCode.LEFT_KEYCODE, new Command.SteerLeftCommand(car));
        this.keyboard.addCommand(KeyCode.RIGHT_KEYCODE, new Command.SteerRightCommand(car));
        this.keyboard.addCommand(KeyCode.BRAKE_KEYCODE, new Command.BrakeCommand(car));
        // Camera
        this.keyboard.addCommand(KeyCode.ZOOM_IN_KEYCODE, new Command.ZoomInCommand(renderService));
        this.keyboard.addCommand(KeyCode.ZOOM_OUT_KEYCODE, new Command.ZoomOutCommand(renderService));
        this.keyboard.addCommand(KeyCode.SWITCH_CAMERA_KEYCODE, new Command.SwitchCameraCommand(renderService));
        // Key up commands
        // Cars
        this.keyboard.addCommand(KeyCode.LEFT_KEYCODE, new Command.ReleaseSteerCommand(car));
        this.keyboard.addCommand(KeyCode.RIGHT_KEYCODE, new Command.ReleaseSteerCommand(car));
        this.keyboard.addCommand(KeyCode.ACCELERATE_KEYCODE, new Command.DecelerateCommand(car));
        this.keyboard.addCommand(KeyCode.BRAKE_KEYCODE, new Command.ReleaseBrakesCommand(car));
    }

}
