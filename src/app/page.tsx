'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function HomePage() {
  const router = useRouter();
  const { user, loading, initialized } = useAuthStore();

  useEffect(() => {
    if (!initialized || loading) return;
    if (user) router.replace('/chat');
    else router.replace('/sign-in');
  }, [user, loading, initialized, router]);

  return (
    <div className="h-screen-safe flex items-center justify-center"
      style={{ background: 'var(--color-background)' }}>
      <div className="flex flex-col items-center gap-4">
        <img src="/logo-and-name.png" alt="CuraAi" className="h-10 object-contain" />
        <div className="flex gap-1.5 mt-2">
          {[0,1,2].map(i => (
            <span key={i} className="typing-dot w-2 h-2 rounded-full"
              style={{ background: 'var(--color-primary)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
