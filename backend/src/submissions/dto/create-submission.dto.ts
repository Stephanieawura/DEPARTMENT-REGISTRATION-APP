import { IsArray, IsNotEmpty, IsString, IsUUID, ArrayMinSize } from 'class-validator';

export class CreateSubmissionDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  courseIds: string[];
}
