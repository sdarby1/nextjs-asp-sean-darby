// /app/api/set-username/route.js
import { prisma } from '@prisma/client';

export async function POST(req) {
  const { userId, username } = await req.json();

  // Überprüfen, ob der Benutzername bereits vergeben ist
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    return new Response(
      JSON.stringify({ success: false, message: 'Benutzername bereits vergeben' }),
      { status: 400 }
    );
  }

  // Benutzernamen in der Datenbank speichern
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { username, validated: true }, // Benutzer als validiert markieren
  });

  return new Response(
    JSON.stringify({ success: true, message: 'Benutzername gespeichert' }),
    { status: 200 }
  );
}
