"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { config } from "@/lib/config";

const TARGET = new Date("2026-09-19T18:30:00+08:00").getTime();
const MAPS_URL =
  "https://www.google.com/maps/search/restaurant+pekin+sutera/@1.5136793,103.650489,14z";

function useCountdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const s = now === null ? null : Math.max(0, Math.floor((TARGET - now) / 1000));
  const pad = (n: number) => String(n).padStart(2, "0");
  return [
    { label: "Days", v: s === null ? "--" : pad(Math.floor(s / 86400)) },
    { label: "Hours", v: s === null ? "--" : pad(Math.floor(s / 3600) % 24) },
    { label: "Minutes", v: s === null ? "--" : pad(Math.floor(s / 60) % 60) },
    { label: "Seconds", v: s === null ? "--" : pad(s % 60) },
  ];
}

function FlipDigit({ char }: { char: string }) {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden border border-[#2B211B]/26 bg-[#2B211B]/[.035]
                 h-[46px] w-[33px] sm:h-[124px] sm:w-[98px]"
      style={{ perspective: "300px", boxShadow: "inset 0 -6px 14px rgba(43,33,27,.05)" }}
    >
      <span
        key={char}
        className="font-forum leading-none text-[#2B211B] text-[25px] sm:text-[64px]"
        style={{ animation: "flipIn .5s cubic-bezier(.2,.7,.3,1)", transformOrigin: "center top" }}
      >
        {char}
      </span>
      <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-[#2B211B]/14" />
    </div>
  );
}

function Countdown() {
  const parts = useCountdown();
  return (
    <div className="flex items-start gap-2 sm:gap-4">
      {parts.map((p) => (
        <div key={p.label} className="flex flex-col items-center gap-[7px] sm:gap-4">
          <div className="flex gap-[3px] sm:gap-[6px]">
            {p.v.split("").map((c, i) => (
              <FlipDigit key={i} char={c} />
            ))}
          </div>
          <span className="font-jakarta uppercase tracking-[.22em] text-[#2B211B]/50 text-[7px] sm:text-[12px]">
            {p.label}
          </span>
        </div>
      ))}
    </div>
  );
}

const SCHEDULE = [
  { n: "01", time: "18:30", zh: "迎宾酒会 · 合影", en: "Cocktails & photos" },
  { n: "02", time: "19:00", zh: "宾客入席", en: "Guests seated" },
  { n: "03", time: "19:30", zh: "喜宴开席", en: "Dinner served" },
];

function PillLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-[#2B211B]/40 rounded-full px-6 py-3 sm:px-12 sm:py-4 font-jakarta font-medium text-[13px] sm:text-[18px] tracking-[.34em] uppercase text-[#2B211B]">
      {children}
    </div>
  );
}

export default function InvitePage() {
  return (
    <main className="flex min-h-screen items-start justify-center bg-[#E8E4D8] px-0 py-0 sm:px-6 sm:py-12">
      <style>{`
        @keyframes flipIn{0%{transform:rotateX(-88deg);opacity:.25}60%{transform:rotateX(8deg);opacity:1}100%{transform:rotateX(0);opacity:1}}
      `}</style>

      <div className="w-full max-w-[1080px]">
        <div
          className="flex w-full flex-col items-center gap-0 bg-[#F4F1EA] px-6 py-16 shadow-[0_24px_60px_rgba(36,24,20,.14)] sm:px-[90px] sm:py-24"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(43,33,27,0) 0 149px, rgba(43,33,27,.07) 149px 150px), repeating-linear-gradient(-45deg, rgba(43,33,27,0) 0 149px, rgba(43,33,27,.07) 149px 150px)",
          }}
        >
          {/* Arch label */}
          <svg viewBox="0 0 900 260" className="block w-full overflow-hidden">
            <path id="archB" d="M 40 250 A 1000 1000 0 0 1 860 250" fill="none" />
            <text
              className="font-jakarta font-light fill-[#2B211B]"
              style={{ fontSize: 42, letterSpacing: ".3em" }}
              textAnchor="middle"
            >
              <textPath href="#archB" startOffset="50%">
                WEDDING INVITATION
              </textPath>
            </text>
          </svg>

          {/* Title */}
          <div className="-mt-2 flex items-center gap-6 sm:gap-10">
            <span className="h-[9px] w-[9px] rounded-full bg-[#2B211B]" />
            <span className="font-noto-serif-sc font-semibold leading-none text-[#2B211B] text-[56px] sm:text-[132px]">
              邀请函
            </span>
            <span className="h-[9px] w-[9px] rounded-full bg-[#2B211B]" />
          </div>

          <div className="mt-6 text-center font-jakarta font-light uppercase leading-[1.7] tracking-[.34em] text-[#2B211B]/70 text-[13px] sm:mt-9 sm:text-[22px]">
            You are invited
            <br />
            to our wedding!
          </div>

          {/* Couple illustration */}
          <div className="mt-10 h-[320px] w-[260px] overflow-hidden rounded-t-[130px] rounded-b-[8px] bg-[#2B211B]/[.04] sm:mt-14 sm:h-[660px] sm:w-[520px] sm:rounded-t-[260px]">
            <Image
              src="/assets/invite/couple-illustration.png"
              alt="Illustration of the couple"
              width={520}
              height={660}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          {/* Date */}
          <div className="mt-10 font-jakarta font-extralight leading-none text-[#2B211B] text-[48px] sm:mt-16 sm:text-[96px]">
            2026.09.19
          </div>

          <div className="mt-6 sm:mt-9">
            <PillLabel>Wedding Date</PillLabel>
          </div>

          <div className="mt-8 sm:mt-12">
            <Countdown />
          </div>

          {/* Timeline */}
          <div className="mt-14 grid w-full grid-cols-3 items-start gap-4 sm:mt-[72px] sm:gap-0">
            {SCHEDULE.map((it) => (
              <div key={it.n} className="flex flex-col items-center gap-3 sm:gap-[22px]">
                <span className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-[#2B211B]/35 font-jakarta font-light text-[13px] text-[#2B211B] sm:h-[62px] sm:w-[62px] sm:text-[22px]">
                  {it.n}
                </span>
                <div className="relative flex h-px w-full items-center justify-center bg-[#2B211B]/35">
                  <span className="h-[6px] w-[6px] rounded-full bg-[#2B211B] sm:h-[10px] sm:w-[10px]" />
                </div>
                <div className="flex flex-col items-center gap-1 text-center sm:gap-2">
                  <div className="font-jakarta font-light text-[#2B211B] text-[15px] sm:text-[32px]">
                    {it.time}
                  </div>
                  <div className="font-noto-serif-sc text-[#2B211B] text-[13px] tracking-[.06em] sm:text-[26px]">
                    {it.zh}
                  </div>
                  <div className="font-jakarta font-light uppercase tracking-[.18em] text-[#2B211B]/60 text-[8px] sm:tracking-[.24em] sm:text-[15px]">
                    {it.en}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 sm:mt-[76px]">
            <PillLabel>Wedding Address</PillLabel>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2 text-center sm:mt-9 sm:gap-3">
            <div className="font-forum text-[#2B211B] text-[24px] sm:text-[40px]">
              Sutera Pekin Restaurant
            </div>
            <div className="font-noto-serif-sc text-[#2B211B] tracking-[.06em] text-[16px] sm:text-[28px]">
              国际宴会厅 · 第八厅
            </div>
            <div className="font-jakarta font-light uppercase tracking-[.2em] text-[#2B211B]/72 text-[11px] sm:text-[20px]">
              International Banquet Hall · Hall 8
            </div>
          </div>

          {/* Hall photo */}
          <div className="mt-6 flex w-full flex-col items-center gap-3 sm:mt-9 sm:gap-[14px]">
            <div className="relative h-[180px] w-full overflow-hidden rounded-[4px] bg-[#2B211B]/6 sm:h-[320px]">
              <Image
                src="/assets/venue/hall-8.jpeg"
                alt="International Banquet Hall 8"
                fill
                sizes="(max-width: 1080px) 100vw, 1080px"
                className="object-cover"
                style={{ filter: "saturate(.88)" }}
              />
            </div>
            <div className="font-jakarta font-light uppercase tracking-[.28em] text-[#2B211B]/55 text-[10px] sm:text-[14px]">
              The banquet hall
            </div>
          </div>

          {/* Map CTA */}
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#2B211B] px-8 py-4 font-jakarta font-semibold uppercase text-[#F4F1EA] no-underline shadow-[0_10px_24px_rgba(43,33,27,.24)] transition-all hover:-translate-y-0.5 hover:bg-[#180F0B] hover:shadow-[0_14px_30px_rgba(43,33,27,.32)] sm:mt-[30px] sm:gap-[14px] sm:px-11 sm:py-5"
            style={{ letterSpacing: ".22em", fontSize: 13 }}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[16px] w-[16px] flex-none sm:h-5 sm:w-5"
              fill="none"
              stroke="#F4F1EA"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.6" />
            </svg>
            <span className="sm:text-[17px]">Map &amp; directions</span>
          </a>

          {/* Sign-off */}
          <div className="mt-14 flex items-center gap-4 sm:mt-[86px] sm:gap-[26px]">
            <span className="font-noto-serif-sc font-semibold tracking-[.12em] text-[#2B211B] text-[22px] sm:text-[40px]">
              志钟 玲玲
            </span>
            <span className="h-px w-[70px] bg-[#2B211B] sm:w-[150px]" />
            <span className="font-noto-serif-sc font-semibold tracking-[.12em] text-[#2B211B] text-[22px] sm:text-[40px]">
              夫妇敬邀
            </span>
          </div>
          <div className="mt-3 font-jakarta font-light uppercase tracking-[.3em] text-[#2B211B]/55 text-[10px] sm:mt-[14px] sm:text-[16px]">
            {config.couple.groom} &amp; {config.couple.bride}
          </div>
        </div>
      </div>
    </main>
  );
}
