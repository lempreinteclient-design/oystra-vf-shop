"use client";

import { useEffect, useRef, useState } from "react";

// Bandeau vidéo pleine largeur (le clip de surf). Autoplay fiable sur mobile,
// muet, en boucle, et mis en pause hors écran pour économiser les ressources.

export default function SurfBanner({
  caption,
  className = "",
}: {
  caption?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const v = videoRef.current;
    if (!el || !v) return;

    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;

    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.then === "function") {
        p.then(() => setNeedsTap(false)).catch(() => setNeedsTap(true));
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) tryPlay();
          else v.pause();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);

    const onInteract = () => tryPlay();
    document.addEventListener("touchstart", onInteract, { passive: true });
    document.addEventListener("click", onInteract);

    return () => {
      io.disconnect();
      document.removeEventListener("touchstart", onInteract);
      document.removeEventListener("click", onInteract);
    };
  }, []);

  return (
    <div ref={ref} className={`relative w-full overflow-hidden bg-black ${className}`}>
      <video
        ref={videoRef}
        poster="/surf-hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        className="h-[46vh] w-full object-cover sm:h-[62vh]"
      >
        <source src="/surf-hero.mp4" type="video/mp4" />
      </video>

      {/* léger fondu haut/bas pour raccorder au fond sombre du site */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--color-void)]/50 via-transparent to-[var(--color-void)]/70" />

      {caption && (
        <p className="pointer-events-none absolute bottom-4 left-5 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-bone)]/80 sm:bottom-6 sm:left-8">
          {caption}
        </p>
      )}

      {needsTap && (
        <button
          type="button"
          onClick={() => videoRef.current?.play().catch(() => {})}
          aria-label="Lancer la vidéo"
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-bone)]/40 bg-[var(--color-void)]/50 backdrop-blur-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-bone)">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
