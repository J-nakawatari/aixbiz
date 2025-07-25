"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import Logo from "./Logo";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* ロゴ */}
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          {/* ナビゲーション */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="#problems" 
              className="text-gray-700 hover:text-indigo-600 transition-colors text-[16px]"
            >
              お悩み
            </Link>
            <Link 
              href="#features" 
              className="text-gray-700 hover:text-indigo-600 transition-colors text-[16px]"
            >
              特徴
            </Link>
            <Link 
              href="#usecases" 
              className="text-gray-700 hover:text-indigo-600 transition-colors text-[16px]"
            >
              活用例
            </Link>
            <Link 
              href="#diagnosis" 
              className="text-gray-700 hover:text-indigo-600 transition-colors text-[16px]"
            >
              簡易診断
            </Link>
            <Link 
              href="#faq" 
              className="text-gray-700 hover:text-indigo-600 transition-colors text-[16px]"
            >
              よくある質問
            </Link>
          </nav>

          {/* CTA ボタン */}
          <Link href="#cta">
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-6 rounded-lg text-[16px]"
            >
              AI導入の相談申し込み
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}