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

  private userLives = new Map<string, number>();

  constructor(private questionService: QuestionService) {}

  // Fonction pour créer un délai
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: any) {
    // Initialise le nombre de vies lors de la connexion
    this.userLives.set(client.id, 0);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleDisconnect(client: any) {
    // Nettoyage à la déconnexion
    this.userLives.delete(client.id);
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
      // Selectionne une question de manière aléatoire
      const question = await this.questionService.getRandomQuestion();

      // Déterminer le nombre de vies
      const lives = question.isMultipleChoice ? 1 : 3;

      // Construire un objet contenant uniquement les propriétés nécessaires
      const questionData = {
        idQuestion: question.id,
        content: question.content,
        choices: question.choices,
        isMultipleChoice: question.isMultipleChoice,
        lives,
      };

      // Envoie une question
      client.emit('newQuestion', { questionData, timer: 15 }); // Envoyer chaque question au client
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

  @SubscribeMessage('submitAnswer')
  async handleSubmitAnswer(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const userAnswer = data.answer;
    const questionId = data.questionId;
    // Récupérer la question par son ID
    const question = await this.questionService.findOne(questionId);
    // Vérifier si la réponse de l'utilisateur est correcte
    const isCorrect = question.correctAnswer === userAnswer;

    // Décrémente le nombre de tentative / vie

    const currentLives = this.userLives.get(client.id) || 0;
    this.userLives.set(client.id, Math.max(0, currentLives - 1));

    // Envoie le résultat de la vérification et les vies restantes
    client.emit('answerResult', {
      correct: isCorrect,
      lives: this.userLives.get(client.id),
    });
  }
}
