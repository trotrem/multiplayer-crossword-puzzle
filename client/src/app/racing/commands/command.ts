namespace CommandPattern {
    export class Command {
        public execute(): void {
            throw new Error("Call of an abstract method!");
        }
    }
}
