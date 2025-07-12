import svgPaths from "./svg-pue779sgmb";
import imgImg from "figma:asset/70634fa7ee8bcab24f14c30d588e96aea984a9cb.png";

function Svg() {
  return (
    <div
      className="absolute h-[166.228px] left-0 top-[434px] w-[1438px]"
      data-name="svg"
    >
      <div className="absolute bottom-0 left-[-0.07%] right-[-0.07%] top-0">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 1440 167"
        >
          <g id="svg">
            <path
              d={svgPaths.pd9f200}
              fill="var(--fill-0, white)"
              id="Vector"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[18px] relative shrink-0 w-[15.75px]" data-name="Frame">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 18"
      >
        <g id="Frame">
          <g clipPath="url(#clip0_9_562)">
            <path
              d={svgPaths.p27beb970}
              fill="var(--fill-0, white)"
              id="Vector"
            />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_9_562">
            <path d="M0 0H15.75V18H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Svg1() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row h-[18px] items-center justify-center left-0 p-0 top-[1.25px] w-[15.75px]"
      data-name="svg"
    >
      <Frame />
    </div>
  );
}

function I() {
  return (
    <div
      className="bg-[rgba(0,0,0,0)] h-[22px] relative shrink-0 w-[15.75px]"
      data-name="i"
    >
      <div className="absolute border-0 border-gray-200 border-solid inset-0 pointer-events-none" />
      <Svg1 />
    </div>
  );
}

function Span() {
  return (
    <div
      className="bg-indigo-600 box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-8 py-[15px] relative rounded-[9999px] shrink-0"
      data-name="span"
    >
      <div className="absolute border-0 border-gray-200 border-solid inset-0 pointer-events-none rounded-[9999px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_10px_15px_0px_rgba(0,0,0,0.1)]" />
      <div className="flex flex-col font-['Montserrat:Medium',_'Noto_Sans_JP:Regular',_sans-serif] h-7 justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[18px] text-left w-[162px]">
        <p className="block leading-[normal]">無料で診断を受ける</p>
      </div>
      <I />
    </div>
  );
}

function Text() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-8 items-start justify-start p-0 relative shrink-0 w-[492px]"
      data-name="text"
    >
      <div className="font-['Inter:Regular',_'Noto_Sans_JP:Bold',_sans-serif] font-normal h-[106px] leading-[0] not-italic relative shrink-0 text-[#000000] text-[0px] text-left w-96">
        <p className="font-['Montserrat:Bold',_'Noto_Sans_JP:Bold',_sans-serif] leading-[56px] text-[48px]">
          <span className="text-gray-900">中小企業のための</span>
          <span className="text-indigo-600">{` AI業務改善診断`}</span>
        </p>
      </div>
      <div className="font-['Montserrat:Medium',_'Noto_Sans_JP:Regular',_sans-serif] h-16 leading-[0] not-italic relative shrink-0 text-[24px] text-gray-800 text-left w-[476px]">
        <p className="block leading-[32px]">{`AI導入ナビゲーターが"いま必要な活用法"を 無料でご提案`}</p>
      </div>
      <div className="font-['Montserrat:Regular',_'Noto_Sans_JP:Regular',_sans-serif] h-28 leading-[0] not-italic relative shrink-0 text-[18px] text-gray-700 text-left w-full">
        <p className="block leading-[28px]">
          高額なシステムや複雑なAI導入は不要。 UX
          Pilotなど、すぐに使えるAIを活かして
          御社の業務課題に合わせた効率化プランを診断・ご提案しま す。
        </p>
      </div>
      <Span />
    </div>
  );
}

function Img() {
  return (
    <div
      className="bg-center bg-cover bg-no-repeat relative shrink-0 size-[624px]"
      data-name="img"
      style={{ backgroundImage: `url('${imgImg}')` }}
    >
      <div className="absolute border-0 border-gray-200 border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame1() {
  return (
    <div className="box-border content-stretch flex flex-row gap-[130px] h-[600px] items-center justify-start p-0 relative shrink-0">
      <Text />
      <Img />
    </div>
  );
}

export default function Section() {
  return (
    <div
      className="bg-gradient-to-r from-[#eef2ff] relative size-full to-[#e0e7ff]"
      data-name="section"
    >
      <div className="box-border content-stretch flex flex-col items-center justify-start p-0 relative size-full">
        <Svg />
        <Frame1 />
      </div>
      <div className="absolute border-0 border-gray-200 border-solid inset-0 pointer-events-none" />
    </div>
  );
}