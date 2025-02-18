"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import SocialAuth from "@/components/auth/SocialAuth";
import Link from "next/link";

export const RegisterForm = () => {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  // React Hook Form für Validierung
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(data) {
    setServerError("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await res.json();
      if (!res.ok) {
        setServerError(responseData.error || "Something went wrong");
        return;
      }

      setSuccessMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setServerError("An error occurred. Please try again.");
    }
  }

  return (
    <form className="sign-in-form" onSubmit={handleSubmit(onSubmit)}>
      {serverError && <p className="error">{serverError}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <div className="input-container">
        {errors.name && <p className="form-error error">{errors.name.message}</p>}
        <div className="input-field">
          <label htmlFor="name" className="input-label">Username</label>
          <input
            type="text"
            id="name"
            {...register("name", {
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
            id="email"
            {...register("email", {
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
            id="password"
            {...register("password", {
              required: { value: true, message: "Please enter your password" },
              minLength: { value: 8, message: "Your password must be at least 8 characters long" },
            })}
          />
        </div>
      </div>

      <button type="submit" className="form-submit-btn" disabled={isSubmitting}>Sign Up</button>
     <SocialAuth />
     <p>You already have an account? <Link href="/login">Sign in here</Link></p>
    </form>
  );
};
