import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateModelDto {
    @ApiProperty()
    name: string;

    @ApiPropertyOptional()
    description?: string;

    @ApiPropertyOptional()
    context_length?: number;

    @ApiPropertyOptional()
    tokenizer?: string;
    
    @ApiPropertyOptional()
    modality?: string;
  }
  