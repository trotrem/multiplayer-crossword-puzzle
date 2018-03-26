export interface IMap<T> {
    [key: string]: T;
}

export interface ICommand {
    execute(): void;
}
