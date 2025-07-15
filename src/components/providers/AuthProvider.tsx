"use client";

import { useEffect } from 'react';
import { initializeAuth } from '@/utils/supabase/auth';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initializeAuth();
  }, []);

  return <>{children}</>;
}