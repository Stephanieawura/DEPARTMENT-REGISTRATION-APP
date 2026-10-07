export class CreatePaymentDto {
  studentId: string;
  reference: string;
  amount: string;
  contactNumber?: string;
  residency?: string;
  hall?: string;
  method?: string;
  transactionId?: string;
  proofUrl?: string;
}
