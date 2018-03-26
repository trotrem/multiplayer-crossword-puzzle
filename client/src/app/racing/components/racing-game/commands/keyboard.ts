// Invoker of command pattern
import { Injectable } from "@angular/core";
import { ICommand, IMap } from "./command";

@Injectable()
export class Keyboard {
    protected _commands: IMap<Array<ICommand>>;

    public addCommand(keyCode: number, cmd: ICommand): void {
        if (!this.hasCommand(keyCode)) {
            this._commands[keyCode.toString()] = new Array<ICommand>();
        }
        this._commands[keyCode.toString()].push(cmd);
    }

    private hasCommand(keyCode: number): boolean {
        return (this.getCommands(keyCode) !== null);
    }

    private getCommands(keyCode: number): Array<ICommand> {
        return this._commands[keyCode.toString()] || null;
    }

    public executeCommands(keyCode: number): void {
        if (this.hasCommand(keyCode)) {
            const commands: Array<ICommand> = this.getCommands(keyCode);

            for (const command of commands) {
                command.execute();
            }
        }
    }
}
