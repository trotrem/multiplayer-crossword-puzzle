/// <reference path="command.ts" />
namespace CommandPattern {
    export class SteerLeftCommand extends Command {
        private receiver: Receiver;

        public constructor(receiver: Receiver) {
            super();
            this.receiver = receiver;
        }

        public execute(): void {
            console.warn("Execute Method of SteerLeft is being called.");
            this.receiver.action();
        }
    }
}
