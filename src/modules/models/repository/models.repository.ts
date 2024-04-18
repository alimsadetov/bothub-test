import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/modules/database/base.repository';
import { ModelEntity } from '../entities/model.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ModelsRepository extends BaseRepository<ModelEntity> {
  constructor(configService: ConfigService) {
    super(configService);
  }
  protected tableName: string = 'models';
}
