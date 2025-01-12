import { Suspense } from 'react';
import NewMembershipForm from './form';

export default function NewMembershipPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewMembershipForm />
    </Suspense>
  );
} 