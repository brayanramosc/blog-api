import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsInt,
  IsArray,
  IsPositive,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ description: 'The title of the post' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ description: 'The content of the post' })
  content?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  @ApiProperty({ description: 'The cover image of the post' })
  coverImage?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @IsOptional()
  @ApiProperty({ description: 'The summary of the post' })
  summary?: string;

  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @IsOptional()
  @ApiProperty({
    description: 'The categories ids of the post',
    example: [1, 2],
  })
  categoryIds?: number[];
}
