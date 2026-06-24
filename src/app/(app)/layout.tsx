'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { BottomNav } from '@/components/layout/BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, loading, initialized } = useAuthStore();

  useEffect(() => {
    if (!initialized || loading) return;
    if (!user) { router.replace('/sign-in'); return; }
  }, [user, loading, initialized, router, pathname]);

  if (!initialized || loading) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: '#F7F7F7' }}>
        <div className="flex flex-col items-center gap-4">
          <img src="/logo.png" alt="Cura" className="w-12 h-12 object-contain" style={{ opacity: 0.8 }} />
          <div className="flex gap-1.5">
            {[0,1,2].map(i => (
              <span key={i} className="typing-dot w-2 h-2 rounded-full"
                style={{ background: '#2E2BFF' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F7F7F7' }}>
      <main className="flex-1 pb-16">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
