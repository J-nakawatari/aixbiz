"use client";

import { Button } from "../ui/button";
import { ImageWithFallback } from "./ImageWithFallback";

// SVGパスをインライン定義
const svgPaths = {
  arrow:
    "M15.4195 9.79453C15.859 9.35508 15.859 8.64141 15.4195 8.20195L9.79453 2.57695C9.35508 2.1375 8.64141 2.1375 8.20195 2.57695C7.7625 3.01641 7.7625 3.73008 8.20195 4.16953L11.9109 7.875H1.125C0.502734 7.875 0 8.37773 0 9C0 9.62227 0.502734 10.125 1.125 10.125H11.9074L8.20547 13.8305C7.76602 14.2699 7.76602 14.9836 8.20547 15.423C8.64492 15.8625 9.35859 15.8625 9.79805 15.423L15.423 9.79805L15.4195 9.79453Z",
  wave: "M0 70.2282L48 59.5282C96 49.2282 192 27.2282 288 27.5282C384 27.2282 480 49.2282 576 59.5282C672 70.2282 768 70.2282 864 54.2282C960 38.2282 1056 6.22815 1152 0.928151C1248 -4.77185 1344 17.2282 1392 27.5282L1440 38.2282V166.228H1392C1344 166.228 1248 166.228 1152 166.228C1056 166.228 960 166.228 864 166.228C768 166.228 672 166.228 576 166.228C480 166.228 384 166.228 288 166.228C192 166.228 96 166.228 48 166.228H0V70.2282Z",
};

function WaveDecoration() {
  return (
    <div className="absolute h-[100px] sm:h-[166px] left-0 -bottom-[1px] w-full z-1">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 1440 167"
      >
        <path d={svgPaths.wave} fill="white" />
      </svg>
    </div>
  );
}

function ArrowIcon() {
  return (
    <div className="h-[18px] w-[15.75px] flex items-center justify-center">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 18"
      >
        <path d={svgPaths.arrow} fill="currentColor" />
      </svg>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-blue-50 to-indigo-100 min-h-[500px] sm:min-h-[600px] lg:h-[600px] overflow-hidden mt-16 sm:mt-20">
      {/* メインコンテンツコンテナ */}
      <div className="flex flex-col items-center justify-start h-full relative">
        {/* 波の装飾 */}
        <WaveDecoration />

        {/* メインコンテンツ */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[0px] items-center justify-center lg:justify-start px-4 sm:px-8 lg:px-16 mx-auto w-full relative z-20 py-12 sm:py-16 lg:py-[100px]" style={{ maxWidth: '90rem' }}>
          {/* 背景画像をコンテンツエリア内に配置 - PCのみ表示 */}
          <div 
            className="hidden lg:block absolute inset-0 bg-no-repeat bg-right bg-contain pointer-events-none"
            style={{ backgroundImage: "url('/images/hero-img01.png')" }}
          />
          {/* 左側：テキストコンテンツ */}
          <div className="flex flex-col gap-6 lg:gap-8 w-full lg:w-[600px] flex-shrink-0 text-center lg:text-left">
            {/* メインタイトル */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight lg:leading-[72px]">
                <span className="text-gray-900 font-bold text-[36px] sm:text-[48px] lg:text-[64px] block lg:inline lg:whitespace-nowrap">
                  中小企業のための
                </span>
                <br className="hidden lg:block" />
                <span className="text-indigo-600 font-bold text-[28px] sm:text-[32px] lg:text-[40px]">
                  AI業務改善診断
                </span>
              </h1>
            </div>

            {/* サブタイトル */}
            <div className="text-xl sm:text-2xl text-gray-800 leading-relaxed w-full">
              <p className="text-[18px] sm:text-[20px] lg:text-[24px]">
                AI導入ナビゲーターが<br />
                <span className="text-green-600">"いま必要な活用法"</span>を無料でご提案
              </p>
            </div>

            {/* 説明文 */}
            <div className="text-base sm:text-lg text-gray-700 leading-relaxed w-full">
              <p className="text-[14px] sm:text-[16px]">
                高額なシステムや複雑なAI導入は不要。
                <br className="sm:hidden" />
                すぐに使えるAIを活かして
                <br className="sm:hidden" />
                御社の業務課題に合わせた効率化プランを診断・ご提案します。
              </p>
            </div>

            {/* CTAボタン */}
            <a href="#diagnosis">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-8 rounded-[8px] text-[24px] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2.5 w-full sm:w-fit mx-auto lg:mx-0">
                簡易AI活用診断
                <ArrowIcon />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}