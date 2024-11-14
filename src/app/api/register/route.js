// pages/api/register.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req, res) {
  const { name, email, image, provider, password } = await req.json();

  try {
    // Check if a user already exists with the same email, but a different provider
    const existingUser = await prisma.user.findFirst({
      where: { email: email },
    });

    if (existingUser) {
      // If the email already exists but from a different provider, reject the registration
      if (existingUser.provider !== provider) {
        return new Response(
          JSON.stringify({ message: "This email is already registered with a different provider." }),
          { status: 400 }
        );
      }

      // If the username is already taken, return an error
      if (existingUser.name === name) {
        return new Response(
          JSON.stringify({ message: "Username already exists" }),
          { status: 400 }
        );
      }
    }

    // Hash password for manual registration (only if password is provided)
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        image,
        provider,
        password: hashedPassword, // Only set if password is provided (manual registration)
      },
    });

    console.log("New user created:", newUser);
    return new Response(JSON.stringify({ message: "User successfully created" }), { status: 201 });

  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
