import { Injectable } from '@nestjs/common';
import { ModelEntity } from '../entities/model.entity';
import { ModelFromOpenrouterDto } from '../dto/model-from-openrouter.dto';

@Injectable()
export class ModelsMapper {
  constructor() {}

  openrouterResponseToModelEntites(openrouterResponse: ModelFromOpenrouterDto[]): ModelEntity[] {
    return openrouterResponse.map((dto) => {
      return {
        id: dto.id,
        name: dto.name,
        description: dto.description,
        context_length: dto.context_length,
        tokenizer: dto.architecture?.tokenizer,
        modality: dto.architecture?.modality,
      };
    });
  }
}
