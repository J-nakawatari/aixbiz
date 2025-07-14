"use client";

import Link from "next/link";
import Logo from "./Logo";

export default function SimpleHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
          <Link 
            href="/" 
            className="text-gray-600 hover:text-indigo-600 transition-colors text-[16px]"
          >
            トップへ戻る
          </Link>
        </div>
      </div>
    </header>
  );
}