'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Pusher from 'pusher-js';

export default function ChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');

  // Nachrichten abrufen und sicherstellen, dass es ein Array ist
  useEffect(() => {
    const fetchMessages = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch('/api/chat/messages');
        const data = await res.json();

        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          console.error('Invalid messages response:', data);
          setMessages([]);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      }
    };

    fetchMessages();

    // Echtzeit-Updates mit Pusher abonnieren
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe('chat');
    channel.bind('new-message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      pusher.unsubscribe('chat');
    };
  }, [session]);

  // Nachricht senden
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message || !receiverEmail) return;

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverEmail,
          content: message,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-container">
      <h1>Chat</h1>

      <div className="message-list">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className={msg.sender.email === session?.user?.email ? 'message sent' : 'message received'}>
              <strong>{msg.sender.email}:</strong> {msg.content}
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>

      <form onSubmit={sendMessage} className="message-form">
        <input
          type="email"
          placeholder="Receiver's email"
          value={receiverEmail}
          onChange={(e) => setReceiverEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
