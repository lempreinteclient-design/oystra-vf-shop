// Pastille de coloris scindée en deux : la moitié haut-gauche = couleur du
// t-shirt, la moitié bas-droite = couleur de l'impression. Les teintes sont
// échantillonnées sur les vraies photos (voir lib/products.ts).

export default function ColorSwatch({
  shirt,
  accent,
  size = 40,
  selected = false,
  title,
  className = "",
}: {
  shirt: string;
  accent: string;
  size?: number;
  selected?: boolean;
  title?: string;
  className?: string;
}) {
  return (
    <span
      title={title}
      aria-label={title}
      className={`inline-block rounded-full shrink-0 transition-transform ${
        selected
          ? "ring-2 ring-[var(--color-blood)] ring-offset-2 ring-offset-[var(--color-void)] scale-110"
          : "ring-1 ring-[var(--color-bone)]/30"
      } ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${shirt} 0 50%, ${accent} 50% 100%)`,
      }}
    />
  );
}
