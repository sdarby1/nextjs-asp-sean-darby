import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const secret = process.env.NEXTAUTH_SECRET;
  let token = await getToken({ req, secret });

  if (!token) {
    console.log('Token not ready, retrying...');
    await new Promise((resolve) => setTimeout(resolve, 200)); // Kurze Verzögerung
    token = await getToken({ req, secret });
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}


// Middleware-Konfiguration
export const config = {
  matcher: ['/profile/:path*'], 
  matcher: ['/chat'],// Middleware greift auf /profile und alle Unterseiten zu
};
