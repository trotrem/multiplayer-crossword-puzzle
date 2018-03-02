/// <reference path="command.ts"/>
namespace CommandPattern {
    export class Invoker {
        private commands: Command[];

        public constructor() {
            this.commands = [];
        }

        public storeAndExecute(command: Command): void {
            this.commands.push(command);
            command.execute();
        }
    }
}
