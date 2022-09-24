import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsString,
  MaxLength,
} from 'class-validator';

export class UserDto {
  
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  email: string;

  @IsString()
  @MaxLength(30)
  nickname: string;

  @IsString()
  @MaxLength(30)
  password: string;
}