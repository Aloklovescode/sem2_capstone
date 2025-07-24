'use client';

import Header from '@/components/Header';
import NewsPage from '@/components/NewsPage';

export default function News() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <NewsPage />
    </main>
  );
}