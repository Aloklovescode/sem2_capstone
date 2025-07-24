'use client';

import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Dashboard />
    </main>
  );
}