import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { SubmissionStatus } from '@prisma/client';

@Injectable()
export class SubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSubmissionDto: CreateSubmissionDto) {
    const { studentId, courseIds } = createSubmissionDto;

    // 1. Validate student exists
    const student = await this.prisma.user.findUnique({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // 2. Check for existing submission
    const existingSubmission = await this.prisma.submission.findFirst({
      where: { studentId }
    });

    if (existingSubmission) {
      throw new BadRequestException('You have already submitted a registration.');
    }

    // 3. Validate all courses exist
    const courses = await this.prisma.course.findMany({
      where: { id: { in: courseIds } },
    });
    
    if (courses.length !== courseIds.length) {
      throw new BadRequestException('One or more selected courses do not exist.');
    }

    // 4. Create Submission and join records within a Transaction
    return this.prisma.$transaction(async (tx) => {
      const submission = await tx.submission.create({
        data: {
          studentId,
          status: SubmissionStatus.PENDING,
          documentUrl: (createSubmissionDto as any).documentUrl,
          courses: {
            create: courseIds.map((courseId) => ({
              course: {
                connect: { id: courseId },
              },
            })),
          },
        },
        include: {
          courses: {
            include: { course: true },
          },
        },
      });

      return submission;
    });
  }

  async findAll() {
    return this.prisma.submission.findMany({
      include: {
        student: { select: { id: true, name: true, studentId: true, program: true, level: true } },
        courses: { include: { course: true } },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        student: { select: { id: true, name: true, studentId: true, program: true, level: true } },
        courses: { include: { course: true } },
      },
    });

    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }
    return submission;
  }

  async updateStatus(id: string, updateSubmissionDto: UpdateSubmissionDto) {
    await this.findOne(id); // Ensure it exists

    return this.prisma.submission.update({
      where: { id },
      data: { status: updateSubmissionDto.status },
      include: {
        student: { select: { name: true, email: true } },
      },
    });
  }

  async findByStudent(studentId: string) {
    return this.prisma.submission.findMany({
      where: { studentId },
      include: {
        courses: { include: { course: true } },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }
}
