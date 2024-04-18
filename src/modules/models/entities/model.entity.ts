import { ApiProperty } from '@nestjs/swagger';

export class ModelEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  context_length?: number;
  @ApiProperty()
  tokenizer?: string;
  @ApiProperty()
  modality?: string;
}
