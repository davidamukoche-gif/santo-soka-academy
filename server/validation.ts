import { z } from 'zod';

const itemSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional().default(''),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
});

export const documentInputSchema = z.object({
  workspaceId: z.string().uuid(),
  clientId: z.string().uuid(),
  kind: z.enum(['INVOICE', 'QUOTATION']),
  issueDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional(),
  currency: z.string().length(3).default('KES'),
  paymentTerms: z.string().max(500).optional(),
  discount: z.number().nonnegative().default(0),
  taxRate: z.number().min(0).max(100).default(0),
  notes: z.string().max(5000).optional(),
  terms: z.string().max(5000).optional(),
  items: z.array(itemSchema).min(1),
});

export const statusSchema = z.object({ status: z.enum(['SENT', 'VIEWED', 'PENDING', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'CANCELLED']) });

export const signatureSchema = z.object({
  signerName: z.string().min(2).max(200),
  signerEmail: z.string().email().optional(),
  signatureText: z.string().max(1000).optional(),
});

export type DocumentInput = z.infer<typeof documentInputSchema>;
