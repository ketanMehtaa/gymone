'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDate, formatPrice } from '@/lib/utils';

interface Payment {
  id: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  createdAt: Date;
  member: {
    user: {
      name: string | null;
      email: string | null;
    };
  };
}

interface RecentPaymentsProps {
  payments: Payment[];
}

export function RecentPayments({ payments }: RecentPaymentsProps) {
  return (
    <div className='space-y-8'>
      {payments.map((payment) => (
        <div key={payment.id} className='flex items-center'>
          <Avatar className='h-9 w-9'>
            <AvatarFallback>
              {payment.member.user.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className='ml-4 space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {payment.member.user.name}
            </p>
            <p className='text-sm text-muted-foreground'>
              {payment.member.user.email}
            </p>
          </div>
          <div className='ml-auto font-medium'>
            <div className='text-right'>
              <p className='text-sm font-medium leading-none'>
                {formatPrice(payment.amount)}
              </p>
              <p
                className={`text-sm ${
                  payment.status === 'COMPLETED'
                    ? 'text-green-500'
                    : payment.status === 'FAILED'
                    ? 'text-red-500'
                    : payment.status === 'REFUNDED'
                    ? 'text-orange-500'
                    : 'text-yellow-500'
                }`}
              >
                {payment.status.toLowerCase()}
              </p>
              <p className='text-xs text-muted-foreground'>
                {formatDate(payment.createdAt)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
