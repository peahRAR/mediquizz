import { Server } from 'socket.io';
export declare class WebsocketGateway {
    server: Server;
    handleStartGame(client: any, payload: any): void;
}
