import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address'
  }),
  password: z.string().min(1, {
    message: 'Password is required'
  })
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address'
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long'
  }),
  name: z.string().min(1, {
    message: 'Name is required'
  })
});

export const MemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.string().min(1, 'Address is required'),
  emergencyContact: z.string().min(10, 'Emergency contact number is required'),
  memberCode: z.string(),
  planId: z.string().optional()
});

export const TrainerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  specialization: z.array(z.string()),
  experience: z.number().min(0),
  certifications: z.array(z.string())
});

export const MembershipPlanSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  duration: z.number().min(1, 'Duration must be at least 1 day'),
  price: z.number().min(0, 'Price must be at least 0'),
  features: z.array(z.string()),
  isActive: z.boolean()
});

export const PaymentSchema = z.object({
  amount: z.number().min(0, 'Amount must be positive'),
  paymentMethod: z.enum(['UPI', 'CASH', 'CARD', 'BANK_TRANSFER']),
  transactionId: z.string().optional(),
  dueDate: z.date().optional()
});
