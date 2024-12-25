import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: 'The old password of the user' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ description: 'The new password of the user', minLength: 6 })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
