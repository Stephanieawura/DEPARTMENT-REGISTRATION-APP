import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password?: string; // Will be hashed, but optional for social logins if added later

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  @IsOptional()
  studentId?: string;

  @IsString()
  @IsOptional()
  program?: string;

  @IsString()
  @IsOptional()
  level?: string;
}
