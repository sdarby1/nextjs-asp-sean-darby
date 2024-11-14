import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export const Header = () => {
  const { data: session } = useSession();

  return (
    <header>
      <Link href="/">Home</Link>
      <Link href="/profile">Profile</Link>
      {!session ? (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      ) : (
        <div className="account-info">
          <p>Welcome, {session.user.name}!</p>
          <img src={session.user.image || '/images/default-profile/default-profile-image.jpg'} alt={session.user.name} className="profile-image" />
          <button onClick={() => signOut()} className="sign-out-btn">Sign Out</button>
        </div>
      )}
    </header>
  );
};

export default Header;
