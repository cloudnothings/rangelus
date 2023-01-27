import Link from 'next/link'
import React from 'react'

const Navbar = ({ title }: { title: string }) => {
  return (
    <div className="h-12 bg-black container min-w-full flex flex-row justify-between">
      <Link href="/" className="flex flex-row items-center justify-center gap-2 px-4 py-2 text-white no-underline">
        <span className="text-2xl font-bold">{title}</span>
      </Link>
      <div className="p-1">
      </div>
    </div>
  )
}

export default Navbar