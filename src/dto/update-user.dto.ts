import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'The username of the user', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: 'The email of the user', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}