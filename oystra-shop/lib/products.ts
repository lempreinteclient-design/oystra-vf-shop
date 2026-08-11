// =============================================================
// DONNÉES PRODUITS — OYSTRÅ
// =============================================================
// C'est ICI que tu modifies tes prix, ton stock, tes descriptions.
// Chaque COLORIS = un produit séparé, affiché tel quel en vitrine.
// Pas besoin de toucher au reste du code.
// =============================================================

export type Size = "XS" | "S" | "M" | "L" | "XL";

export const SIZES: Size[] = ["XS", "S", "M", "L", "XL"];

export interface Product {
  slug: string;
  name: string; // nom de base, ex: "T-shirt oystrå"
  colorName: string; // coloris affiché, ex: "Blanc & Bleu"
  shirt: string; // couleur hex du t-shirt (anneau de la pastille)
  accent: string; // couleur hex de l'impression (pastille)
  tagline: string;
  description: string;
  price: number; // en euros
  // 1re image = visuel principal en vitrine.
  // Ordre conseillé : [dos porté, face à plat, lifestyle]
  images: string[];
  // Stock par taille. Modifie ces chiffres librement.
  stock: Record<Size, number>;
}

// ---- STOCK PAR DÉFAUT ----
// ⚠️ Valeurs provisoires (5 par taille). Remplace simplement les nombres.
const DEFAULT_STOCK: Record<Size, number> = {
  XS: 5,
  S: 5,
  M: 5,
  L: 5,
  XL: 5,
};

// Texte commun à tous les coloris (procédé de fabrication).
const FABRICATION =
  "Designé à la main sur l'île d'Oléron, produit en atelier partenaire. " +
  "Logo brodé sur le torse, illustration verre-vague sérigraphiée " +
  "dans le dos, et les trois phares sérigraphiés en bas de dos. " +
  "Coupe oversize, 100 % coton épais.";

export const PRODUCTS: Product[] = [
  {
    slug: "tee-blanc-bleu",
    name: "T-shirt oystrå",
    colorName: "Blanc Océan",
    shirt: "#ece9e3",
    accent: "#4f5f96",
    tagline: "Surfing Brand — Blanc Océan",
    description:
      "Le signature oystrå en blanc, impression bleu profond. " + FABRICATION,
    price: 30,
    images: [
      "/images/bleu-1.jpg",
      "/images/bleu-2.jpg",
      "/images/bleu-3.jpg",
    ],
    stock: { ...DEFAULT_STOCK },
  },
  {
    slug: "tee-blanc-orange",
    name: "T-shirt oystrå",
    colorName: "Rosé Pamplemousse",
    shirt: "#ece9e3",
    accent: "#d98e4f",
    tagline: "Surfing Brand — Rosé Pamplemousse",
    description:
      "Le signature oystrå en blanc, impression orange coucher de soleil. " +
      FABRICATION,
    price: 30,
    images: [
      "/images/orange-1.jpg",
      "/images/orange-2.jpg",
      "/images/orange-3.jpg",
    ],
    stock: { ...DEFAULT_STOCK },
  },
  {
    slug: "tee-rose-rouge",
    name: "T-shirt oystrå",
    colorName: "Fraise Framboise",
    shirt: "#e79fb3",
    accent: "#be2138",
    tagline: "Surfing Brand — Fraise Framboise",
    description:
      "Le signature oystrå sur t-shirt rose, impression rouge profond. " +
      FABRICATION,
    price: 30,
    images: [
      "/images/rouge-1.jpg",
      "/images/rouge-2.jpg",
      "/images/rouge-3.jpg",
    ],
    stock: { ...DEFAULT_STOCK },
  },
];

// ---- LIVRAISON ----
// Modifie ces montants si tes coûts réels changent.
export const SHIPPING = {
  relay: {
    label: "Point Relais (Mondial Relay)",
    description: "Livré en 3 à 5 jours ouvrés dans le point relais de ton choix.",
    price: 4.9,
  },
  home: {
    label: "Livraison à domicile (Mondial Relay)",
    description: "Livré en 3 à 5 jours ouvrés directement chez toi.",
    price: 6.9,
  },
  pickup: {
    label: "Retrait en main propre",
    description:
      "À Saint-Denis-d'Oléron. On s'organise ensemble par message Instagram après ta commande.",
    price: 0,
  },
};

export type ShippingMethod = keyof typeof SHIPPING;

export const INSTAGRAM_HANDLE = "@oystra_surfingbrand"; // ⚠️ remplace par ton vrai pseudo Insta

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function totalStock(product: Product): number {
  return SIZES.reduce((sum, s) => sum + product.stock[s], 0);
}
