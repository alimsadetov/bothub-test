import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import globals from './config/global.config';
import dbConfig from './config/db.config';
import { LoggerModule } from './logger/logger.module';
import { LoggerMiddleware } from './middlewares/log-incoming-request.middleware';
import { CustomLoggerService } from './logger/custom-logger.service';
import { ModelsModule } from './modules/models/models.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      load: [globals, dbConfig],
      isGlobal: true,
    }),
    LoggerModule,
    DatabaseModule,
    ModelsModule,
  ],
  controllers: [],
  providers: [CustomLoggerService],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
