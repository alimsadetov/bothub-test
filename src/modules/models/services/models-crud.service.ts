import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelsRepository } from '../repository/models.repository';
import { ModelEntity } from '../entities/model.entity';
import { CreateModelDto } from '../dto/create-model.dto';
import { UpdateModelDto } from '../dto/update-model.dto';

@Injectable()
export class ModelsCrudService {
  constructor(
    private readonly modelsRepository: ModelsRepository,
  ) {}

  async findOneById(id: string): Promise<ModelEntity> {
    return await this.modelsRepository.findOneById(id)
  }

  async findOneByIdOrThrowError(id: string): Promise<ModelEntity> {
    const model =  await this.findOneById(id)
    if (!model){
      throw new NotFoundException('Model not found.')
    }
    return model
  }

  async findMany(): Promise<ModelEntity[]> {
    return await this.modelsRepository.findAll()
  }

  async create(dto: CreateModelDto): Promise<ModelEntity> {
    return await this.modelsRepository.insert(dto)
  }

  async update(id: string, dto: UpdateModelDto): Promise<ModelEntity> {
    return await this.modelsRepository.updateByParams(<ModelEntity>dto, {id})
  }

  async delete(id: string): Promise<ModelEntity> {
    const model =  await this.modelsRepository.delete(id)
    if (!model){
      throw new NotFoundException('Model not found.')
    }
    return model
  }
}
