'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

const Page = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();


  const onSubmit = async (data) => {
    setServerError(''); // Clear previous errors

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Successfully registered", 200);
        router.push('/login?success=account_created');
      } else {
        const errorData = await response.json();
        setServerError(errorData.message); // Set server error message
      }
    } catch (error) {
      setServerError("An unexpected error occurred. Please try again.");
      console.error(error.message, 500);
    }
  };

  return (
    <div className="layout-container">
      <div className="sign-in-container">
        <h1 className="form-headline">Sign Up</h1>
        <form className="sign-in-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {serverError && <p className="form-error error">{serverError}</p>}
          <div className="input-container">
            {errors.name && <p className="form-error error">{errors.name.message}</p>}
            <div className="input-field">
              <label htmlFor="name" className="input-label">Username</label>
              <input
                type="text"
                autoComplete="off"
                aria-invalid={errors.name ? "true" : "false"}
                {...register('name', {
                  required: { value: true, message: "Please enter your username" },
                  minLength: { value: 4, message: "Your username must be at least 4 characters long" },
                  maxLength: { value: 20, message: "Your username can't be more than 20 characters long" },
                })}
              />
            </div>
          </div>

          <div className="input-container">
            {errors.email && <p className="form-error error">{errors.email.message}</p>}
            <div className="input-field">
              <label htmlFor="email" className="input-label">Email</label>
              <input
                type="email"
                autoComplete="off"
                aria-invalid={errors.email ? "true" : "false"}
                {...register('email', {
                  required: { value: true, message: "Please enter your email" },
                  pattern: {
                    value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />
            </div>
          </div>

          <div className="input-container">
            {errors.password && <p className="form-error error">{errors.password.message}</p>}
            <div className="input-field">
              <label htmlFor="password" className="input-label">Password</label>
              <input
                type="password"
                aria-invalid={errors.password ? "true" : "false"}
                {...register('password', {
                  required: { value: true, message: "Please enter your password" },
                  minLength: { value: 8, message: "Your password must be at least 8 characters long" },
                })}
              />
            </div>
          </div>

          <button className="form-submit-btn" type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </form>
        <div className="social-sign-in">
          <Link href="/" onClick={() => signIn('github')}>
            <svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
              <defs></defs>
              <g id="Page-1">
                <g id="Dribbble-Light-Preview">
                  <g id="icons">
                    <path id="github-_142_" data-name="github-[#142]" className="cls-1" d="M400,0c220.92,0,400,183.59,400,410.12,0,181.17-114.48,334.84-273.32,389.12-20.28,4.04-27.48-8.75-27.48-19.69,0-13.52.48-57.68.48-112.56,0-38.22-12.8-63.18-27.16-75.92,89.08-10.16,182.68-44.84,182.68-202.36,0-44.79-15.52-81.35-41.2-110.08,4.16-10.35,17.88-52.07-3.92-108.55,0,0-33.52-11-109.88,42.05-31.96-9.08-66.2-13.65-100.2-13.81-34,.16-68.2,4.73-100.12,13.81-76.44-53.05-110.04-42.05-110.04-42.05-21.72,56.48-8,98.2-3.88,108.55-25.56,28.73-41.2,65.29-41.2,110.08,0,157.13,93.4,192.32,182.24,202.7-11.44,10.23-21.8,28.32-25.4,54.82-22.8,10.49-80.72,28.61-116.4-34.06,0,0-21.16-39.41-61.32-42.29,0,0-39-.53-2.72,24.92,0,0,26.2,12.6,44.4,60,0,0,23.48,73.2,134.76,48.4.2,34.28.56,66.6.56,76.35,0,10.84-7.36,23.54-27.32,19.73C114.6,745.08,0,591.33,0,410.12,0,183.59,179.12,0,400,0"/>
                  </g>
                </g>
              </g>
            </svg>
          </Link>
          <Link href="/" onClick={() => signIn('google')}>
            <svg className="cls-1" id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
              <defs></defs>
              <g id="Page-1">
                <g id="Dribbble-Light-Preview">
                  <g id="icons">
                    <path id="google-_178_" data-name="google-[#178]" className="cls-1" d="M792.86,320.16h-384.41c0,39.98,0,119.92-.25,159.9h222.76c-8.54,39.98-38.8,95.96-81.56,124.14-.04-.04-.08.23-.16.2-56.85,37.54-131.88,46.05-187.59,34.86-87.32-17.34-156.43-80.68-184.49-161.11.16-.12.29-1.23.41-1.31-17.56-49.9-17.56-116.7,0-156.68h-.04c22.63-73.48,93.81-140.53,181.26-158.87,70.33-14.92,149.69,1.23,208.05,55.84,7.76-7.6,107.42-104.9,114.89-112.81C482.34-76.27,163.07-12.73,43.61,220.45h-.04s.04,0-.2.45h0c-59.1,114.53-56.65,249.49.41,358.55-.16.12-.29.2-.41.31,51.71,100.35,145.81,177.3,259.19,206.6,120.44,31.58,273.73,10,376.4-82.87.04.04.08.08.12.12,86.99-78.36,141.15-211.84,113.79-383.46"/>
                  </g>
                </g>
              </g>
            </svg>
          </Link>
        </div>
        <p>You already have an account? <Link href="/login">Sign in here</Link></p>
      </div>
    </div>
  );
};

export default Page;
