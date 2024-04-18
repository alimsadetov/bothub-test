import { Body, Controller, Post, Get, Put, Delete, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ModelsCrudService } from '../services/models-crud.service';
import { ModelEntity } from '../entities/model.entity';
import { CreateModelDto } from '../dto/create-model.dto';
import { UpdateModelDto } from '../dto/update-model.dto';

@ApiTags('Models')
@Controller('models')
export class ModelsController {
  constructor(private readonly crudService: ModelsCrudService) {}

  @Post()
  @ApiOperation({ summary: 'Создать модель' })
  @ApiResponse({ status: 201, type: ModelEntity })
  async create(@Body() dto: CreateModelDto): Promise<ModelEntity> {
    return this.crudService.create(dto)
  }

  @Get()
  @ApiOperation({ summary: 'Получить все модели' })
  @ApiResponse({ status: 200, type: ModelEntity, isArray: true })
  async find(): Promise<ModelEntity[]> {
    return this.crudService.findMany()
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить модель' })
  @ApiResponse({ status: 200, type: ModelEntity })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateModelDto,
  ): Promise<ModelEntity> {
    return this.crudService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить модель' })
  @ApiResponse({ status: 200, type: ModelEntity })
  async delete(@Param('id') id: string): Promise<ModelEntity> {
    return this.crudService.delete(id)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить модель по id' })
  @ApiResponse({ status: 200, type: ModelEntity })
  async findOne(@Param('id') id: string): Promise<ModelEntity> {
    return this.crudService.findOneByIdOrThrowError(id)
  }
}
