'use client';

import Header from '@/components/Header';
import ProfilePage from '@/components/ProfilePage';

export default function Profile() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <ProfilePage />
    </main>
  );
}