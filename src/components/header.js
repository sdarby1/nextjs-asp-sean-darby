import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';

export const Header = () => {
  const { data: session } = useSession();
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    // Überprüfen, ob ein benutzerdefinierter Login vorhanden ist
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      // Benutzerdaten aus dem `localStorage` parsen und speichern
      setLocalUser(JSON.parse(userData));
    }
  }, []);

  const signOut = () => {
    if (session) {
      // Wenn über NextAuth angemeldet
      nextAuthSignOut();
    } else if (localUser) {
      // Wenn über benutzerdefinierte API angemeldet
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setLocalUser(null);
    }
  };

  const displayUser = session?.user || localUser;

  return (
    <header>
      <Link href="/">Home</Link>
      <Link href="/profile">Profile</Link>
      {!displayUser ? (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      ) : (
        <div className="account-info">
          <p>Welcome, {displayUser.name}!</p>
          <img 
            src={displayUser.image || '/images/default-profile/default-profile-image.jpg'} 
            alt={displayUser.name} 
            className="profile-image" 
          />
          <button onClick={signOut} class="sign-out-btn">Sign Out</button>
        </div>
      )}
    </header>
  );
};

export default Header;
