import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @Min(1)
  credits: number;

  @IsString()
  @IsNotEmpty()
  lecturer: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  prerequisites?: string;

  @IsString()
  @IsOptional()
  schedule?: string;

  @IsString()
  @IsOptional()
  venue?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  capacity?: number;
}
