/// <reference path="command.ts"/>
namespace CommandPattern {
    export class Receiver {
        public action(): void {
            console.warn("action called!");
        }
    }
}
