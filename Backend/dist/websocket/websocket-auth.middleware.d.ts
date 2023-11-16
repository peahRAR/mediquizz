import { NestMiddleware } from '@nestjs/common';
export declare class WebSocketAuthMiddleware implements NestMiddleware {
    use(client: any, next: () => void): Promise<void>;
}
