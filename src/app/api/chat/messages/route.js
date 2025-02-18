import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route'; // NextAuth-Konfiguration importieren
import Pusher from 'pusher';

const prisma = new PrismaClient();

// Pusher-Instanz erstellen
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

// Nachrichten abrufen
export async function GET(req) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: user.id }, { receiverId: user.id }],
      },
      include: {
        sender: { select: { email: true } },
        receiver: { select: { email: true } },
      },
      orderBy: { timestamp: 'asc' },
    });

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

// Nachricht senden
export async function POST(req) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { receiverEmail, content } = await req.json();

    if (!receiverEmail || !content) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    // Absender-ID holen
    const sender = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!sender) {
      return new Response(JSON.stringify({ error: 'Sender not found' }), { status: 404 });
    }

    // Empfänger-ID holen
    const receiver = await prisma.user.findUnique({
      where: { email: receiverEmail },
      select: { id: true },
    });

    if (!receiver) {
      return new Response(JSON.stringify({ error: 'Receiver not found' }), { status: 404 });
    }

    // Nachricht in der Datenbank speichern
    const newMessage = await prisma.message.create({
      data: {
        senderId: sender.id,
        receiverId: receiver.id,
        content,
      },
      include: {
        sender: { select: { email: true } },
        receiver: { select: { email: true } },
      },
    });

    // Nachricht mit Pusher versenden (Echtzeit)
    await pusher.trigger('chat', 'new-message', newMessage);

    return new Response(JSON.stringify(newMessage), { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
