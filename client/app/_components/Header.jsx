"use client"
import Link from 'next/link'
import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Cross, Hamburger } from 'lucide-react'
import { useAuth } from '../context/auth'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [auth, setAuth, { logout }] = useAuth();
    const router = useRouter();
    const handleClick = useCallback(() => setIsMenuOpen(prev => !prev), [])

   
    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

                <div className="flex items-center gap-2.5">
                    <Link href="/"><span className="font-semibold text-2xl tracking-tight">Transcribe Ai</span></Link>
                </div>


                {auth.isAuthenticated ? (<div className='flex items-center gap-2'>
                    <button onClick={logout} className="text-sm px-5 py-2 rounded-lg border border-gray-100  hover:bg-stone-100 hover:border-stone-400 transition-all duration-150 font-medium">
                        Log out
                    </button>
                    <button className='text-sm px-5 py-2 rounded-lg bg-stone-900 text-stone-50 hover:bg-stone-700 transition-all duration-150 font-medium' onClick={() => { router.push("/dashboard") }}>Dashboard</button>
                </div>) : (<div className="flex items-center gap-2">
                    <button onClick={() => router.push('/login')} className="text-sm px-5 py-2 rounded-lg border border-gray-100  hover:bg-stone-100 hover:border-stone-400 transition-all duration-150 font-medium">
                        Log in
                    </button>
                    <button onClick={() => router.push('/signup')} className="text-sm px-5 py-2 rounded-lg bg-stone-900 text-stone-50 hover:bg-stone-700 transition-all duration-150 font-medium">
                        Get started
                    </button>
                    <nav className="flex md:hidden items-center gap-4">
                        <button
                            onClick={handleClick}
                            className="p-2 rounded-full "
                        >
                            {isMenuOpen ? <Cross size={30} /> : <Hamburger size={30} />}
                        </button>
                    </nav>
                </div>)}


            </div>
        </header>
    )
}