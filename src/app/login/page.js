'use client';

import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SocialAuth from '@/components/auth/SocialAuth';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  const onSubmit = async (data) => {
    setErrorMessage(null); // Fehler zurücksetzen

    const res = await signIn('credentials', {
      redirect: false, 
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      // Fehlerbehandlung
      setErrorMessage(res.error);
    } else if (res?.ok) {
      // Weiterleitung auf die gewünschte Seite
      router.push('/profile'); 
    }
  };

  return (
    <div className="layout-container">
      <div className="sign-in-container">
      <h1 className="form-headline">Login</h1>
      <form className="sign-in-form" onSubmit={handleSubmit(onSubmit)}>
        {/* Email-Feld */}
        <div className="input-container">
        {errors.email && <p className="error">{errors.email.message}</p>}
          <div className="input-field">
            <label htmlFor="email" className="input-label">Email</label>
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Invalid email format',
                },
              })}
            />
          </div>
        </div>

        {/* Passwort-Feld */}
        <div className="input-container">
          {errors.password && <p className="error">{errors.password.message}</p>}
          <div className="input-field">
            <label htmlFor="password" className="input-label">Password</label>
            <input
              type="password"
              id="password"
              {...register('password', { required: 'Password is required' })}
            />
          </div>
        </div>

        {/* Fehlermeldung anzeigen */}
        {errorMessage && <p className="error">{errorMessage}</p>}

        {/* Submit-Button */}
        <button className="form-submit-btn" type="submit">Login</button>
        <SocialAuth />
      </form>

        <p>You dont have an account? <Link href="/register">Sign up here</Link></p>
    </div>
    </div>
  );
}
