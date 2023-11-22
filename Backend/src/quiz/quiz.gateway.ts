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

  // Fonction pour créer un délai
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: any) {
    // Handle connection event
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleDisconnect(client: any) {
    // Handle disconnection event
  }

  @SubscribeMessage('startGame')
  async handleStartGame(
    @MessageBody() data: GameParams,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Received startGame event', data);
    // ... initialisation de la partie ...

    const nbQuestion = data.nbQuestion || 1; // Utilisez la valeur fournie ou une valeur par défaut
    client.emit('gameStarting', { timer: 10, nbQuestion });
    await this.delay(10000);

    for (let i = 0; i < nbQuestion; i++) {
      const question = await this.questionService.getRandomQuestion();

      client.emit('newQuestion', { question, timer: 15 }); // Envoyer chaque question au client
      // délai pour répondre à la question
      await this.delay(15000);

      // Envoyer la réponse (à ajuster en fonction de votre logique de réponse)
      client.emit('answer', { answer: question.correctAnswer, timer: 5 });
      await this.delay(5000); // Afficher la réponse pendant 5 secondes

      // Temps d'attente avant la prochaine question
      if (i < nbQuestion - 1) {
        client.emit('waitingForNext', { timer: 3 }); // Attendre 3 secondes avant la prochaine question
        await this.delay(3000);
      }
    }

    client.emit('gameEnded', 'La partie est terminée'); // Signaler la fin du quiz
  }
}
