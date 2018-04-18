import { Injectable } from "@angular/core";
import { ICommand, IMap } from "./command";

@Injectable()
export class KeyboardEventService {
    private _commands: IMap<Array<ICommand>>;

    public constructor() {
        this._commands = {};
    }

    public addCommand(keyCode: number, cmd: ICommand): void {
        if (!this.hasCommand(keyCode)) {
            this._commands[keyCode.toString()] = new Array<ICommand>();
        }
        this._commands[keyCode.toString()].push(cmd);
    }
    public executeKeyUpCommands(keyCode: number): void {
        if (this.hasCommand(keyCode)) {
            const commands: Array<ICommand> = this.getCommands(keyCode);
            commands[0].execute();
        }
    }

    public executeKeyDownCommands(keyCode: number): void {
        if (this.hasCommand(keyCode)) {
            const commands: Array<ICommand> = this.getCommands(keyCode);
            if (commands.length > 1) {
                commands[1].execute();
            }
        }
    }

    private hasCommand(keyCode: number): boolean {
        return (this.getCommands(keyCode) !== null);
    }

    private getCommands(keyCode: number): Array<ICommand> {
        return this._commands[keyCode.toString()] || null;
    }
}
