'use client';


import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      // Redirect, wenn der Benutzer nicht eingeloggt ist
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>; // Ladeanzeige, während Session überprüft wird
  }

  if (session) {
    return (
      <div className="profile-section">
        <h1>Willkommen, {session.user.name || 'Benutzer'}!</h1>
        <p className="profile-text">Email: {session.user.email}</p>
        <Link href="/chat" className="chat-link">Chats</Link>
      </div>
    );
  }

  return null; // Fallback, sollte nie erreicht werden
}
