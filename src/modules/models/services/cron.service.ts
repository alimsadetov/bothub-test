import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiService } from './api.service';
import { ModelsMapper } from '../mappers/models.mapper';
import { ModelFromOpenrouterDto } from '../dto/model-from-openrouter.dto';
import { ModelsCrudService } from './models-crud.service';

@Injectable()
export class CronService {
  constructor(private readonly apiService: ApiService, private readonly mapper: ModelsMapper, private readonly crudService: ModelsCrudService) {
    this.getAndSaveModelsFromOpenrouter()
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async getAndSaveModelsFromOpenrouter() {
    const data: ModelFromOpenrouterDto[] = await this.apiService.getDataFromOpenrouter()
    const models = this.mapper.openrouterResponseToModelEntites(data)
    for (let model of models){
      const found = await this.crudService.findOneById(model.id)
      if (!found){
        await this.crudService.create(model)
      }
    }
  }
}
