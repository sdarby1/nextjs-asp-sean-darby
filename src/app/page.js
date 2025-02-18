import { getServerSession } from 'next-auth'
import React from 'react'
import { authOptions } from './api/auth/[...nextauth]/route'
import { User } from './user'

export default async function Home() {
  const session = await getServerSession(authOptions)
  return (
    <div class="home">
      <h1 >Home</h1>
      <button className="container">
        Hover me
      </button>
      <div>
        <h2>Server Session</h2>
        <pre>{JSON.stringify(session)}</pre>
      </div>
      <div>
        <h2>Client Session</h2>
        <User />
        </div>
    </div>
  )
}

