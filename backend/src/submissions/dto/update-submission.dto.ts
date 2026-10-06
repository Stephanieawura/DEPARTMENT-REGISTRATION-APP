import { IsEnum, IsOptional } from 'class-validator';
import { SubmissionStatus } from '@prisma/client';

export class UpdateSubmissionDto {
  @IsEnum(SubmissionStatus)
  @IsOptional()
  status?: SubmissionStatus;
}
