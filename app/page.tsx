'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard for better UX
    router.push('/dashboard');
  }, [router]);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Dashboard />
    </main>
  );
}