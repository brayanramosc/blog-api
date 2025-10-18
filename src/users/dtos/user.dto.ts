import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ValidateNested()
  @Type(() => CreateProfileDto)
  @IsNotEmpty()
  profile: CreateProfileDto;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['profile']),
) {
  @ValidateNested()
  @Type(() => UpdateProfileDto)
  @IsOptional()
  profile: UpdateProfileDto;
}
