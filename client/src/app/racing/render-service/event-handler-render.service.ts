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
    private keyboard: Keyboard;
    public constructor(car: Car) {
        this.keyboard = new Keyboard();
        this.initCommands(car);
    }

    public initCommands(car: Car): void {
        // Method factory serait a ajouter? Messemble que c'est redondant mais je savais pas quoi faire. idée?
        // Key down commdands (index 0)
        this.keyboard.AddCommand(keyCode.ACCELERATE_KEYCODE, new AccelerationCommand(car));
        this.keyboard.AddCommand(keyCode.LEFT_KEYCODE, new SteerLeftCommand(car));
        this.keyboard.AddCommand(keyCode.RIGHT_KEYCODE, new SteerRightCommand(car));
        this.keyboard.AddCommand(keyCode.BRAKE_KEYCODE, new BrakeCommand(car));
        // Key up commands (index 1)
        this.keyboard.AddCommand(keyCode.LEFT_KEYCODE, new ReleaseSteerCommand(car));
        this.keyboard.AddCommand(keyCode.RIGHT_KEYCODE, new ReleaseSteerCommand(car));
        this.keyboard.AddCommand(keyCode.ACCELERATE_KEYCODE, new DecelerateCommand(car));
        this.keyboard.AddCommand(keyCode.BRAKE_KEYCODE, new ReleaseBrakesCommand(car));
    }

    public handleKeyDown(event: KeyboardEvent, car: Car): void {
        this.keyboard.ExecuteKeyDownCommands(event.keyCode);
    }

    public handleKeyUp(event: KeyboardEvent, car: Car): void {
        this.keyboard.ExecuteKeyUpCommands(event.keyCode);
    }
}
