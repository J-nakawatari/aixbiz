import { Mail, Facebook, Twitter, Instagram } from "lucide-react";

function Logo() {
  return (
    <div className="flex items-center gap-1">
      <div className="bg-indigo-500 rounded size-10 flex items-center justify-center">
        <span className="text-white text-[24px] font-normal">ai</span>
      </div>
      <span className="text-[24px] text-indigo-400">xbiz</span>
    </div>
  );
}

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
                <a href="#" className="text-[14px] text-slate-400 hover:text-white transition-colors">
                  AI業務診断
                </a>
              </li>
              <li>
                <a href="#" className="text-[14px] text-slate-400 hover:text-white transition-colors">
                  活用事例
                </a>
              </li>
              <li>
                <a href="#" className="text-[14px] text-slate-400 hover:text-white transition-colors">
                  コンサルティング
                </a>
              </li>
            </ul>
          </div>

          {/* Company Information */}
          <div>
            <h3 className="text-[14px] text-white mb-4">会社情報</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[14px] text-slate-400 hover:text-white transition-colors">
                  会社概要
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
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span className="text-[14px] text-slate-400">info@aixbiz.jp</span>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
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