// /pages/api/login.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const prisma = new PrismaClient();

// POST /api/login
export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
      });
    }

    // JWT payload
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Speichern der Benutzerdaten und des Tokens im localStorage
    const userData = { name: user.name, email: user.email, image: user.image || '/default-profile.png' };
    // Dies wird im Frontend durch die Fetch-Anfrage gespeichert:
    return new Response(JSON.stringify({ token, user: userData }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
