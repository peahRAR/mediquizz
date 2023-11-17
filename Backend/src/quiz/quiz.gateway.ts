import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { QuestionService } from 'src/question/question.service';
import { GameParams } from './DTO/game-params.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class QuizGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private questionService: QuestionService) {}

  handleConnection(client: any) {
    // Handle connection event
  }

  handleDisconnect(client: any) {
    // Handle disconnection event
  }

  @SubscribeMessage('startGame')
  async handleStartGame(
    @MessageBody() data: GameParams,
    @ConnectedSocket() client: Socket,
  ) {
    // Initialisation de la partie.
    const nbQuestion = data.nbQuestion || 1; // Utilisez la valeur fournie ou une valeur par défaut
    client.emit('gameStarting', 'La partie va commencer');

    for (let i = 0; i < nbQuestion; i++) {
      const question = await this.questionService.getRandomQuestion();
      client.emit('newQuestion', question); // Envoyer chaque question au client
      // Vous pouvez ajouter un délai ici si nécessaire
    }

    client.emit('gameEnded', 'La partie est terminée'); // Signaler la fin du quiz
  }
}
