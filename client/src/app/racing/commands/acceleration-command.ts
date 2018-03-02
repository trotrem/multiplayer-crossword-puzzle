/// <reference path="command.ts" />
namespace CommandPattern {
    export class AccelerateCommand extends Command {
        private receiver: Receiver;

        public constructor(receiver: Receiver) {
            super();
            this.receiver = receiver;
        }

        public execute(): void {
            console.warn("Execute Method of Accelerate is being called.");
            this.receiver.action();
        }
    }
}
