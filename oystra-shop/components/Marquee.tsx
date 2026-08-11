const ITEMS = [
  "SÉRIE LIMITÉE",
  "ÎLE D'OLÉRON",
  "DESIGNÉ À LA MAIN",
  "BRODERIE & SÉRIGRAPHIE",
  "SURFING BRAND",
];

export default function Marquee() {
  const content = [...ITEMS, ...ITEMS];

  return (
    <div className="relative overflow-hidden bg-[var(--color-blood)] py-3 border-y border-[var(--color-bone)]/10">
      <div className="flex whitespace-nowrap marquee-track w-max">
        {[...content, ...content].map((item, i) => (
          <span
            key={i}
            className="font-display text-base sm:text-lg text-[var(--color-bone)] px-6 flex items-center gap-6"
          >
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-bone)]" />
          </span>
        ))}
      </div>
    </div>
  );
}
