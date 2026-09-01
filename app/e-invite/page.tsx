"use client";

import { useEffect, useState, type CSSProperties } from "react";
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
      className="relative flex items-center justify-center overflow-hidden rounded-[3px] border border-peach/25 bg-peach/5
                 h-[46px] w-[33px] sm:h-[82px] sm:w-[62px]"
      style={{ perspective: "300px", boxShadow: "inset 0 -6px 14px rgba(149,53,41,.07)" }}
    >
      <span
        key={char}
        className="font-forum leading-none text-peach text-[25px] sm:text-[46px]"
        style={{ animation: "flipIn .5s cubic-bezier(.2,.7,.3,1)", transformOrigin: "center top" }}
      >
        {char}
      </span>
      <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-peach/20" />
    </div>
  );
}

function Countdown() {
  const parts = useCountdown();
  return (
    <div className="flex items-start gap-2 sm:gap-[22px]">
      {parts.map((p) => (
        <div key={p.label} className="flex flex-col items-center gap-[7px] sm:gap-[10px]">
          <div className="flex gap-[3px] sm:gap-[5px]">
            {p.v.split("").map((c, i) => (
              <FlipDigit key={i} char={c} />
            ))}
          </div>
          <span className="font-jakarta uppercase tracking-[.22em] text-dark/55 text-[7px] sm:text-[9px]">
            {p.label}
          </span>
        </div>
      ))}
    </div>
  );
}

const SCHEDULE = [
  { n: "01", title: "Cocktail Session", time: "6:30 PM", note: "Cocktail hour followed by a photo session." },
  { n: "02", title: "Wedding Dinner", time: "7:00 PM", note: "Wedding dinner with live band performance." },
];

function fadeInUp(delay: number, duration = 0.7, playing = true): CSSProperties {
  return {
    animationName: "fadeInUp",
    animationDuration: `${duration}s`,
    animationTimingFunction: "cubic-bezier(.16,.84,.44,1)",
    animationFillMode: "both",
    animationDelay: `${delay}s`,
    animationPlayState: playing ? "running" : "paused",
  };
}

export default function EInvitePage() {
  // Content sits behind the Preloader curtain (layout.tsx) until the user clicks
  // "Enter", which fires "wedding:play" at an unpredictable time — so the entrance
  // animation is paused until then, instead of racing the curtain on mount.
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const onWeddingPlay = () => setEntered(true);
    document.addEventListener("wedding:play", onWeddingPlay);
    // No curtain mounted (Preloader disabled, or already dismissed) — nothing
    // will ever fire "wedding:play", so don't wait forever.
    const hasPreloader = !!document.querySelector('[role="status"][aria-live="polite"]');
    if (!hasPreloader) setEntered(true);
    return () => document.removeEventListener("wedding:play", onWeddingPlay);
  }, []);

  // Browsers block audio autoplay without a real user gesture, and with
  // Preloader disabled nothing ever supplies one — so fire "wedding:play" on
  // the visitor's first tap/click/keypress anywhere on the page.
  useEffect(() => {
    const startMusic = () => {
      document.dispatchEvent(new CustomEvent("wedding:play"));
    };
    window.addEventListener("pointerdown", startMusic, { once: true });
    window.addEventListener("keydown", startMusic, { once: true });
    return () => {
      window.removeEventListener("pointerdown", startMusic);
      window.removeEventListener("keydown", startMusic);
    };
  }, []);

  return (
    <main className="flex justify-center sm:px-8 sm:py-16">
      <style>{`
        @keyframes flipIn{0%{transform:rotateX(-88deg);opacity:.25}60%{transform:rotateX(8deg);opacity:1}100%{transform:rotateX(0);opacity:1}}
        @keyframes fadeInUp{0%{opacity:0;transform:translateY(16px)}100%{opacity:1;transform:translateY(0)}}
      `}</style>

      <article className="w-full max-w-[760px] border border-peach/20 bg-cream shadow-[0_24px_60px_rgba(36,24,20,.10)]">
        <div className="m-[14px] border border-peach/30 sm:m-[18px]">
          {/* Names */}
          <header
            className="flex flex-col items-center px-6 pt-9 text-center sm:px-[60px] sm:pt-[54px]"
            style={fadeInUp(0, 1.4, entered)}
          >
            <p className="font-jakarta text-[10px] uppercase tracking-[.28em] text-dark/55 sm:text-[11px]">
              You are invited
            </p>
            <h1 className="mt-4 font-dynalight leading-[1.05] text-peach text-[58px] sm:mt-5 sm:text-[100px]">
              {config.couple.groom}
            </h1>
            <span className="font-forum text-dark/50 text-[16px] sm:my-1 sm:text-[22px]">&amp;</span>
            <h1 className="font-dynalight leading-[1.05] text-peach text-[58px] sm:text-[100px]">
              {config.couple.bride}
            </h1>
            <p className="mt-4 font-jakarta text-[11px] tracking-[.16em] text-dark/80 sm:mt-[26px] sm:text-[13px]">
              SATURDAY · 19 SEPTEMBER 2026 · 6:30 PM
            </p>
          </header>

          {/* Countdown */}
          <section
            className="flex flex-col items-center gap-4 px-5 pt-6 sm:px-[60px] sm:pt-10"
            style={fadeInUp(0.15, 0.7, entered)}
          >
            <Countdown />
            <p className="font-forum italic text-sage text-[13px] sm:text-[14px]">until we say &ldquo;I do&rdquo;</p>
          </section>

          {/* Hall photo */}
          <figure
            className="relative mt-7 h-[210px] w-full sm:mt-[46px] sm:h-[340px]"
            style={fadeInUp(0.3, 0.7, entered)}
          >
            <Image
              src="/assets/venue/hall-8.jpeg"
              alt="Hall 8 entrance at Sutera Pekin Restaurant"
              fill
              sizes="(max-width: 760px) 100vw, 760px"
              className="object-cover"
            />
          </figure>

          {/* Venue */}
          <section
            className="flex flex-col items-center gap-2 px-6 pt-[18px] text-center sm:px-[60px] sm:pt-[34px]"
            style={fadeInUp(0.45, 0.7, entered)}
          >
            <p className="font-jakarta text-[9px] uppercase tracking-[.18em] text-sage sm:text-[10px]">
              Look for Hall 8 · 国际宴会厅
            </p>
            <p className="mt-2 font-jakarta text-[10px] uppercase tracking-[.3em] text-peach/80 sm:mt-3">
              The venue
            </p>
            <h2 className="font-forum text-dark text-[26px] sm:text-[40px]">Sutera Pekin Restaurant</h2>
            <p className="font-jakarta text-[12px] leading-[1.8] text-dark/70 sm:text-[13px]">
              Hall 8 · Johor Bahru, Malaysia
              <br />
              Free parking on site, first come first served
            </p>
          </section>

          {/* Map + directions */}
          <section className="px-5 pt-4 sm:px-[60px] sm:pt-[34px]" style={fadeInUp(0.6, 0.7, entered)}>
            <div className="overflow-hidden border border-peach/20">
              <iframe
                title="Venue map"
                src={config.venueMapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[150px] w-full border-0 sm:h-[240px]"
              />
            </div>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-[14px] block border border-peach bg-peach py-[15px] text-center font-jakarta text-[11px]
                         tracking-[.2em] text-cream transition-colors hover:border-sage hover:bg-sage sm:mx-auto sm:w-fit sm:px-[34px]"
            >
              GET DIRECTIONS
            </a>
          </section>

          {/* Order of the day */}
          <section
            className="px-6 pb-9 pt-7 sm:px-[60px] sm:pb-[56px] sm:pt-[46px]"
            style={fadeInUp(0.75, 0.7, entered)}
          >
            <p className="text-center font-jakarta text-[10px] uppercase tracking-[.3em] text-peach/80">
              Order of the day
            </p>
            <ul className="mt-5 flex flex-col gap-4 sm:mt-[26px] sm:gap-[22px]">
              {SCHEDULE.map((it) => (
                <li
                  key={it.n}
                  className="flex flex-col gap-1 border-t border-peach/25 pt-[14px] sm:flex-row sm:items-start sm:gap-[26px] sm:pt-5"
                >
                  <span className="hidden min-w-[70px] font-forum text-[44px] leading-none text-peach/22 sm:block">
                    {it.n}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-forum text-dark text-[19px] sm:text-[28px]">{it.title}</h3>
                    <p className="mt-1 font-jakarta text-[12px] leading-[1.7] text-dark/70 sm:mt-[6px] sm:text-[13px]">
                      {it.note}
                    </p>
                  </div>
                  <span className="font-forum text-dark text-[15px] sm:text-[22px]">{it.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-center font-forum italic tracking-[.15em] text-sage text-[12px] sm:mt-[34px] sm:text-[13px]">
              {config.hashtag}
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
