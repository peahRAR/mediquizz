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

  handleConnection(client: any) {
    this.userLives.set(client.id, 0);
  }

  handleDisconnect(client: any) {
    this.userLives.delete(client.id);
  }

  @SubscribeMessage('startGame')
  async handleStartGame(
    @MessageBody() data: GameParams,
    @ConnectedSocket() client: Socket,
  ) {
    const nbQuestion = data.nbQuestion || 1;
    client.emit('gameStarting', { timer: 10, nbQuestion });

    setTimeout(() => {
      this.processQuestions(client, nbQuestion, 0);
    }, 10000);
  }

  processQuestions(
    client: Socket,
    nbQuestion: number,
    currentQuestionIndex: number,
  ) {
    if (currentQuestionIndex < nbQuestion) {
      this.sendNewQuestion(client, nbQuestion, currentQuestionIndex);
    } else {
      client.emit('gameEnded', 'La partie est terminée');
    }
  }

  async sendNewQuestion(
    client: Socket,
    nbQuestion: number,
    questionIndex: number,
  ) {
    const question = await this.questionService.getRandomQuestion();
    const lives = question.isMultipleChoice ? 1 : 3;

    const questionData = {
      idQuestion: question.id,
      content: question.content,
      choices: question.choices,
      isMultipleChoice: question.isMultipleChoice,
      lives,
    };

    client.emit('newQuestion', { questionData, timer: 15 });

    setTimeout(() => {
      client.emit('answer', { answer: question.correctAnswer, timer: 5 });

      setTimeout(() => {
        this.processQuestions(client, nbQuestion, questionIndex + 1);
      }, 5000); // 5 secondes pour la correction
    }, 15000); // 15 secondes pour répondre à la question
  }

  @SubscribeMessage('submitAnswer')
  async handleSubmitAnswer(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const userAnswer = data.answer;
    const questionId = data.questionId;
    const question = await this.questionService.findOne(questionId);
    const isCorrect = question.correctAnswer === userAnswer;

    const currentLives = this.userLives.get(client.id) || 0;
    this.userLives.set(client.id, Math.max(0, currentLives - 1));

    client.emit('answerResult', {
      correct: isCorrect,
      lives: this.userLives.get(client.id),
    });
  }
}
