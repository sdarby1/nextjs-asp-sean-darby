// /app/choose-username/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function ChooseUsername() {
  const { data: session } = useSession();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Überprüfe, ob der Benutzername gültig ist
    if (username.length < 4 || username.length > 16) {
      setError('Der Benutzername muss zwischen 4 und 16 Zeichen lang sein.');
      return;
    }

    // Sende den neuen Benutzernamen an die API, um ihn in der Datenbank zu speichern
    const response = await fetch('/api/set-username', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: session.user.id, username }),
    });

    const data = await response.json();
    if (data.success) {
      // Weiterleitung zur Hauptseite oder wo immer du den Benutzer hinleiten möchtest
      router.push('/');
    } else {
      setError(data.message || 'Ein Fehler ist aufgetreten.');
    }
  };

  return (
    <div>
      <h1>Wähle einen Benutzernamen</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Benutzername"
        />
        <button type="submit">Speichern</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
