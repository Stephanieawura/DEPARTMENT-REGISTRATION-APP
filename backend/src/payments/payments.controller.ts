import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('api/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initialize')
  initialize(
    @Body('studentId') studentId: string,
    @Body('reference') reference: string,
    @Body('amount') amount: string,
    @Body('contactNumber') contactNumber: string,
    @Body('residency') residency: string,
    @Body('hall') hall: string,
    @Body('method') method: string,
  ) {
    if (!studentId || !reference || !amount) {
      throw new BadRequestException('studentId, reference, and amount are required');
    }

    return this.paymentsService.create({
      studentId, reference, amount, contactNumber, residency, hall, method,
    });
  }

  @Post('webhook')
  webhook(
    @Body('reference') reference: string,
    @Body('status') status: string,
  ) {
    if (!reference || !status) {
      throw new BadRequestException('reference and status are required');
    }
    return this.paymentsService.handleWebhook(reference, status);
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: string) {
    return this.paymentsService.findByStudent(studentId);
  }
}
