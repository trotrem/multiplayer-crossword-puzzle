// Maniere d'utiliser moins d'import peut etre?
import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import * as Command from "../commands/concrete-commands/headers";
import * as KeyCode from "../commands/key-code";
import { KeyUp, KeyDown } from "../commands/key-press";

@Injectable()
export class EventHandlerRenderService {
    // private keyboard: Keyboard;
    public constructor(car: Car) {
        this.initCommands(car);
    }

    public initCommands(car: Car): void {
        // Key down commands
        KeyDown.Instance.addCommand(KeyCode.ACCELERATE_KEYCODE, new Command.AccelerationCommand(car));
        KeyDown.Instance.addCommand(KeyCode.LEFT_KEYCODE, new Command.SteerLeftCommand(car));
        KeyDown.Instance.addCommand(KeyCode.RIGHT_KEYCODE, new Command.SteerRightCommand(car));
        KeyDown.Instance.addCommand(KeyCode.BRAKE_KEYCODE, new Command.BrakeCommand(car));
        KeyDown.Instance.addCommand(KeyCode.ZOOM_IN_KEYCODE, new Command.ZoomInCommand());
        KeyDown.Instance.addCommand(KeyCode.ZOOM_OUT_KEYCODE, new Command.ZoomOutCommand());
        KeyDown.Instance.addCommand(KeyCode.SWITCH_CAMERA_KEYCODE, new Command.SwitchCameraCommand());
        // Key up commands
        KeyUp.Instance.addCommand(KeyCode.LEFT_KEYCODE, new Command.ReleaseSteerCommand(car));
        KeyUp.Instance.addCommand(KeyCode.RIGHT_KEYCODE, new Command.ReleaseSteerCommand(car));
        KeyUp.Instance.addCommand(KeyCode.ACCELERATE_KEYCODE, new Command.DecelerateCommand(car));
        KeyUp.Instance.addCommand(KeyCode.BRAKE_KEYCODE, new Command.ReleaseBrakesCommand(car));
    }

    public handleKeyDown(event: KeyboardEvent, car: Car): void {
        KeyDown.Instance.executeCommands(event.keyCode);
    }

    public handleKeyUp(event: KeyboardEvent, car: Car): void {
        KeyUp.Instance.executeCommands(event.keyCode);
    }
}
