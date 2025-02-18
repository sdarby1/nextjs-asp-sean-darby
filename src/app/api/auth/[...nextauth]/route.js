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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isRegister: { label: "Register", type: "hidden" },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Missing email or password");
        }

        // Prüfen, ob der Nutzer existiert
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (credentials.isRegister === "true") {
          // Registrierungslogik
          if (user) {
            throw new Error("User already exists");
          }

          if (!credentials.name) {
            throw new Error("Username is required for registration");
          }

          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          user = await prisma.user.create({
            data: {
              name: credentials.name,
              email: credentials.email,
              password: hashedPassword,
              provider: "credentials",
            },
          });
        } else {
          // Login-Logik
          if (!user || !user.password) {
            throw new Error("No user found with this email");
          }

          const valid = await bcrypt.compare(credentials.password, user.password);
          if (!valid) {
            throw new Error("Invalid password");
          }
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
