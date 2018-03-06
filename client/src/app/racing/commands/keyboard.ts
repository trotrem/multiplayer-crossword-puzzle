// Invoker of command pattern
import { ICommand, IMap } from "./command";

export class Keyboard {
    private commands: IMap<Array<ICommand>>;

    public constructor() {
        this.commands = {};
    }

    public AddCommand(keyCode: number, cmd: ICommand): void {
        if (!this.HasCommand(keyCode)) {
            this.commands[keyCode.toString()] = new Array<ICommand>();
        }
        this.commands[keyCode.toString()].push(cmd);
    }

    private HasCommand(keyCode: number): boolean {
        return (this.GetCommands(keyCode) !== null);
    }

    private GetCommands(keyCode: number): Array<ICommand> {
        return this.commands[keyCode.toString()] || null;
    }

    public ExecuteKeyDownCommands(keyCode: number): void {
        if (this.HasCommand(keyCode)) {
            const commands: Array<ICommand> = this.GetCommands(keyCode);
            commands[0].Execute();
        }
    }

    public ExecuteKeyUpCommands(keyCode: number): void {
        if (this.HasCommand(keyCode)) {
            const commands: Array<ICommand> = this.GetCommands(keyCode);
            commands[1].Execute();
        }
    }

    public ExecuteCommands(keyCode: number): void {
        if (this.HasCommand(keyCode)) {
            const commands: Array<ICommand> = this.GetCommands(keyCode);

            for (const command of commands) {
                command.Execute();
            }
        }
    }
}
