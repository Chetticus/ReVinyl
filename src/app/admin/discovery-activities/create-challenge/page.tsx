import { Suspense } from 'react';
import CreateChallengeClient from '../../../../components/admin/challenge/CreateChallengeClient';

export default function Page() {
  return (
    <Suspense fallback={null /* hoặc skeleton */}>
      <CreateChallengeClient />
    </Suspense>
  );
}
