import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { socket_id, channel_name } = await req.json();
  const authResponse = pusher.authenticate(socket_id, channel_name);
  
  return new Response(JSON.stringify(authResponse), { status: 200 });
}
