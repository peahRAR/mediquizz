import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { Category } from './category/category.entity';
import { Question } from './question/question.entity';
import { QuestionModule } from './question/question.module';
import { QuizGateway } from './quiz/quiz.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        autoLoadEntities: true,
        entities: [Category, Question],
        synchronize: configService.get('TYPEORM_SYNC') === 'true', // Attention: mettre false en production
      }),
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    QuestionModule,
  ],
  controllers: [AppController],
  providers: [AppService, QuizGateway],
})
export class AppModule {}
