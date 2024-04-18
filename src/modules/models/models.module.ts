import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ApiService } from './services/api.service';
import { ModelsCrudService } from './services/models-crud.service';
import { ModelsController } from './controllers/crud.controller';
import { ModelsRepository } from './repository/models.repository';
import { ScheduleModule } from '@nestjs/schedule';
import { ModelsMapper } from './mappers/models.mapper';
import { CronService } from './services/cron.service';

@Module({
  imports: [DatabaseModule, ScheduleModule.forRoot(),],
  controllers: [ModelsController],
  providers: [ApiService, ModelsCrudService, ModelsRepository, ModelsMapper, CronService],
  exports: [],
})
export class ModelsModule {}
