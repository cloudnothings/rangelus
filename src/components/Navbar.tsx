import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <div className="h-12 bg-black container min-w-full flex flex-row justify-between">
      <Link href="/" className="flex flex-row items-center justify-center gap-2 px-4 py-2 text-white no-underline">
        <span className="text-2xl font-bold">Cloud</span>
      </Link>
      <div className="p-1">
        <LoginButton />
      </div>
    </div>
  )
}

const LoginButton: React.FC = () => {
  const { data: sessionData } = useSession();
  return (
    <button
      className="rounded-md bg-white/10 p-2 font-semibold text-white no-underline transition hover:bg-white/20"
      onClick={sessionData ? () => void signOut() : () => void signIn()}
    >
      {sessionData ? "Sign out" : "Sign in"}
    </button>
  );
};

export default Navbar