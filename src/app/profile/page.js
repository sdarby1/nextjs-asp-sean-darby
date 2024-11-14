import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>Your Profile
        <Link href="/profile/edit">Edit</Link>
    </div>
  )
}

export default page