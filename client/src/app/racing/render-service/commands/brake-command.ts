/// <reference path="command.ts"/>
namespace CommandPattern {
    export class BrakeCommand extends Command {
        private receiver: Receiver;

        public constructor(receiver: Receiver) {
            super();
            this.receiver = receiver;
        }

        public execute(): void {
            console.warn("Execute Method of Brake is being called.");
            this.receiver.action();
        }
    }
}
