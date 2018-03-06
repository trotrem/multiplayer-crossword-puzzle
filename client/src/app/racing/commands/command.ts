export interface IMap<T> {
    [key: string]: T;
}

export interface ICommand {
    Execute(): void;
}
