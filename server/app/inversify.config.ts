import { Container } from "inversify";
import Types from "./types";
import { Server } from "./server";
import { Application } from "./app";
import { Routes } from "./routes";
import { SocketsHandler } from "./crossword/socketsHandler";
import { CrosswordRoutes } from "./crossword/crossword-routes";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.Routes).to(Routes);
container.bind(Types.SocketsHandler).to(SocketsHandler);
container.bind(Types.CrosswordRoutes).to(CrosswordRoutes);

export { container };
