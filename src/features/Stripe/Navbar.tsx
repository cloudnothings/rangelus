import { signIn, signOut } from 'next-auth/react';
import Link from 'next/link'
import React from 'react'

const Navbar = ({ loggedIn }: { loggedIn: boolean }) => {
  return (
    <div className="h-12 bg-black container min-w-full flex flex-row justify-between">
      <Link href="/" className="flex flex-row items-center justify-center gap-2 px-4 py-2 text-white no-underline">
        <span className="text-2xl font-bold">Stripe Dev</span>
      </Link>
      <div className="flex flex-row gap-1 p-1">
        <button
          className="rounded-md bg-white/10 p-2 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={loggedIn ? () => void signOut() : () => void signIn()}
        >
          {loggedIn ? "Sign out" : "Sign in"}
        </button>
      </div>
    </div>
  )
}

export default Navbar