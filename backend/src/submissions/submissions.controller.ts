import { Controller, Get, Post, Body, Patch, Param, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

@Controller('api/submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      }
    })
  }))
  create(
    @Body('studentId') studentId: string,
    @Body('courseIds') courseIdsStr: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!studentId || !courseIdsStr) {
      throw new BadRequestException('studentId and courseIds are required');
    }
    
    let courseIds: string[] = [];
    try {
      courseIds = JSON.parse(courseIdsStr);
    } catch (e) {
      throw new BadRequestException('courseIds must be a valid JSON array string');
    }

    const documentUrl = file ? `/uploads/${file.filename}` : null;
    return this.submissionsService.create({ studentId, courseIds, documentUrl } as any);
  }

  @Get()
  findAll() {
    return this.submissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionsService.findOne(id);
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: string) {
    return this.submissionsService.findByStudent(studentId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ) {
    return this.submissionsService.updateStatus(id, updateSubmissionDto);
  }
}
