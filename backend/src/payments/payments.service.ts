import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const student = await this.prisma.user.findUnique({ where: { id: createPaymentDto.studentId } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${createPaymentDto.studentId} not found`);
    }

    return this.prisma.payment.create({
      data: {
        studentId: createPaymentDto.studentId,
        reference: createPaymentDto.reference,
        amount: createPaymentDto.amount,
        contactNumber: createPaymentDto.contactNumber,
        residency: createPaymentDto.residency,
        hall: createPaymentDto.hall,
        method: createPaymentDto.method,
        transactionId: createPaymentDto.transactionId,
        proofUrl: createPaymentDto.proofUrl,
      },
    });
  }

  async handleWebhook(reference: string, status: string) {
    const payment = await this.prisma.payment.findUnique({ where: { reference } });
    if (!payment) {
      throw new NotFoundException(`Payment with reference ${reference} not found`);
    }

    // Convert 'success' or 'failed' to PaymentStatus enum
    const newStatus = status === 'success' ? 'APPROVED' : status === 'failed' ? 'REJECTED' : 'PENDING';

    return this.prisma.payment.update({
      where: { reference },
      data: { status: newStatus as any },
    });
  }

  async findByStudent(studentId: string) {
    return this.prisma.payment.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
