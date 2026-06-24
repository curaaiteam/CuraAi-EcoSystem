'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, setInitialized, fetchProfile, createProfile } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);

      if (firebaseUser) {
        setUser(firebaseUser);
        let profile = await fetchProfile(firebaseUser.uid);
        if (!profile) {
          profile = await createProfile(firebaseUser);
        }
      } else {
        setUser(null);
        useAuthStore.getState().signOut();
      }

      setLoading(false);
      setInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
