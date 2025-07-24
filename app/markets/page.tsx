'use client';

import Header from '@/components/Header';
import MarketsPage from '@/components/MarketsPage';

export default function Markets() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <MarketsPage />
    </main>
  );
}