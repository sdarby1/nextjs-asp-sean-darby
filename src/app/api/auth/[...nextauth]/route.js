import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // Hinzufügen des CredentialsProvider für manuellen Login
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error('No user found with this email');
        }

        // Passwort überprüfen
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        // Benutzer zurückgeben, der in der Session gespeichert wird
        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === 'google' || account.provider === 'github') {
        const { name, email, image } = user;
        const { provider } = account;

        try {
          const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name,
              email,
              image,
              provider,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            if (errorData.error) {
              console.error('Fehler:', errorData.error);
              return `/auth/error?message=${encodeURIComponent(errorData.error)}`;
            }
          }

          return true;

        } catch (error) {
          console.error('Fehler beim Laden in die Datenbank:', error);
          return false;
        }
      }

      return true;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
