"use client"
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const Header = () => {
    const [menuActive, setMenuActive] = useState(false);
    
    return (
        <header className="bg-white shadow-md relative w-full z-100">
            <div className="flex items-center justify-between p-2 md:p-4 max-w-screen-xl mx-auto">
                {/* Logo */}
                <div className="flex-1">
                    <Link href="https://www.drinfinityai.com" className="py-2">
                        <Image
                            src="/logo.jpeg"
                            alt="Dr. Infinity AI"
                            width={69.97}
                            height={40}
                            className="object-contain"
                        />
                    </Link>
                </div>

                {/* Navigation */}
                <nav className={`flex-1 ${menuActive ? 'hidden' : 'hidden'} md:flex items-center justify-end space-x-6`}>
                    <Link href="https://drinfinityai.com" className="text-sm text-gray-700 font-bold mr-8">
                        Home
                    </Link>
                    <Link href="/" className="text-sm text-gray-700 font-bold mr-8">
                        Dr. Infinity AI
                    </Link>
                    <Link href="https://drinfinityai.com/preferences" className="text-sm text-gray-700 font-bold mr-8">
                        Preferences
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-2xl p-2"
                    onClick={() => setMenuActive(!menuActive)}
                >
                    ☰
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`absolute top-full left-0 right-0 bg-white p-4 shadow-md ${menuActive ? 'block' : 'hidden'} md:hidden`}>
                <nav className="flex flex-col">
                    <Link href="https://drinfinityai.com" className="text-sm text-gray-700 font-bold py-2 border-b border-gray-200">
                        Home
                    </Link>
                    <Link href="/" className="text-sm text-gray-700 font-bold py-2 border-b border-gray-200">
                        Dr. Infinity AI
                    </Link>
                    <Link href="https://drinfinityai.com/preferences" className="text-sm text-gray-700 font-bold py-2 border-b border-gray-200">
                        Preferences
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;