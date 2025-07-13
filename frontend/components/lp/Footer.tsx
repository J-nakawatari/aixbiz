import { Mail } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white py-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="col-span-1">
            <Logo />
            <p className="text-[14px] text-slate-400 mt-4 leading-[24px]">
              中小企業のためのAI業務改善診断サービス。
              無料でAI活用の第一歩をサポートします。
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[14px] text-white mb-4">サービス</h3>
            <ul className="space-y-2">
              <li>
                <a href="#cta" className="text-[14px] text-slate-400 hover:text-white transition-colors">
                  AI導入のご相談
                </a>
              </li>
              <li>
                <a href="#industry-usage" className="text-[14px] text-slate-400 hover:text-white transition-colors">
                  活用事例
                </a>
              </li>
            </ul>
          </div>

          {/* Company Information */}
          <div>
            <h3 className="text-[14px] text-white mb-4">運営情報</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[14px] text-slate-400 hover:text-white transition-colors">
                  運営者情報
                </a>
              </li>
              <li>
                <a href="#" className="text-[14px] text-slate-400 hover:text-white transition-colors">
                  プライバシーポリシー
                </a>
              </li>
              <li>
                <a href="#" className="text-[14px] text-slate-400 hover:text-white transition-colors">
                  利用規約
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[14px] text-white mb-4">お問い合わせ</h3>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span className="text-[14px] text-slate-400">info@aixbiz.jp</span>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-slate-800 pt-8 text-center">
          <p className="text-[14px] text-slate-400">
            © 2025 aixbiz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}