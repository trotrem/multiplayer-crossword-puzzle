/// <reference path="command.ts" />
namespace CommandPattern {
    export class SteerRightCommand extends Command {
        private receiver: Receiver;

        public constructor(receiver: Receiver) {
            super();
            this.receiver = receiver;
        }

        public execute(): void {
            console.warn("Execute Method of SteerRight is being called.");
            this.receiver.action();
        }
    }
}
