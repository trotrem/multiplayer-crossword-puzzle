import { Injectable } from "@angular/core";
import { Keyboard } from "./keyboard";

@Injectable()
export class KeyDown extends Keyboard {
    private static _instance: Keyboard;

    public static get Instance(): Keyboard {
        return ((this._instance) || (this._instance = new this()));
    }

    public constructor() {
        super();
        this._commands = {};
        window.addEventListener("keydown", (event: KeyboardEvent): void => {
            if (this.executeCommands(event.keyCode || event.which)) {
                event.preventDefault();
            }
        });
    }
}

@Injectable()
export class KeyUp extends Keyboard {
    private static _instance: Keyboard;

    public static get Instance(): Keyboard {
        return ((this._instance) || (this._instance = new this()));
    }

    private constructor() {
        super();
        this._commands = {};
        window.addEventListener("keyup", (event: KeyboardEvent): void => {
            if (this.executeCommands(event.keyCode || event.which)) {
                event.preventDefault();
            }
        });
    }
}
