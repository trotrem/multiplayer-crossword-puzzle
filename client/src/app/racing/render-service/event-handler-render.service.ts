// Maniere d'utiliser moins d'import peut etre?
import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { Keyboard } from "../commands/keyboard";
import { AccelerationCommand } from "../commands/acceleration-command";
import { SteerLeftCommand } from "../commands/steerLeft-command";
import { SteerRightCommand } from "../commands/steerRight-command";
import { BrakeCommand } from "../commands/brake-command";
import { ReleaseSteerCommand } from "../commands/releaseSteer-command";
import { DecelerateCommand } from "../commands/decelerate-command";
import { ReleaseBrakesCommand } from "../commands/releasebBrakes-command";
import * as keyCode from "../commands/key-code";

@Injectable()
export class EventHandlerRenderService {
    // private keyboard: Keyboard;
    public constructor(car: Car) {
        this.initCommands(car);
    }

    public initCommands(car: Car): void {
        // Method factory serait a ajouter? Messemble que c'est redondant mais je savais pas quoi faire. idée?
        // Key down commands (index 0)
        Keyboard.Instance.AddCommand(keyCode.ACCELERATE_KEYCODE, new AccelerationCommand(car));
        Keyboard.Instance.AddCommand(keyCode.LEFT_KEYCODE, new SteerLeftCommand(car));
        Keyboard.Instance.AddCommand(keyCode.RIGHT_KEYCODE, new SteerRightCommand(car));
        Keyboard.Instance.AddCommand(keyCode.BRAKE_KEYCODE, new BrakeCommand(car));
        // Key up commands (index 1)
        Keyboard.Instance.AddCommand(keyCode.LEFT_KEYCODE, new ReleaseSteerCommand(car));
        Keyboard.Instance.AddCommand(keyCode.RIGHT_KEYCODE, new ReleaseSteerCommand(car));
        Keyboard.Instance.AddCommand(keyCode.ACCELERATE_KEYCODE, new DecelerateCommand(car));
        Keyboard.Instance.AddCommand(keyCode.BRAKE_KEYCODE, new ReleaseBrakesCommand(car));
    }

    public handleKeyDown(event: KeyboardEvent, car: Car): void {
        Keyboard.Instance.ExecuteKeyDownCommands(event.keyCode);
    }

    public handleKeyUp(event: KeyboardEvent, car: Car): void {
        Keyboard.Instance.ExecuteKeyUpCommands(event.keyCode);
    }
}
