# oystrå — Guide de mise en ligne

Ton site est prêt. Voici comment le mettre en ligne gratuitement sur Vercel,
étape par étape.

## 1. Créer un compte Vercel (gratuit)

1. Va sur https://vercel.com
2. Clique sur "Sign Up", connecte-toi avec ton email ou GitHub

## 2. Mettre le projet sur GitHub (recommandé, le plus simple)

1. Crée un compte sur https://github.com si tu n'en as pas
2. Crée un nouveau dépôt (bouton vert "New")
3. Décompresse le fichier `oystra-shop.zip` que je t'ai donné
4. Suis les instructions GitHub pour uploader le dossier `oystra-shop`
   (tu peux glisser-déposer les fichiers directement sur la page du dépôt
   si tu ne connais pas Git en ligne de commande)

## 3. Connecter Vercel à ton dépôt

1. Sur Vercel, clique "Add New" puis "Project"
2. Choisis ton dépôt GitHub `oystra-shop`
3. Laisse tous les réglages par défaut (Vercel détecte Next.js automatiquement)
4. Clique "Deploy"
5. En 1-2 minutes, ton site est en ligne avec une adresse du type
   `oystra-shop.vercel.app`

## 4. Modifier tes infos (stock, prix, pseudo Instagram)

Tout est centralisé dans un seul fichier :
```
lib/products.ts
```

C'est là que tu peux changer :
- Le stock par taille et coloris (cherche `DEFAULT_STOCK` et les blocs
  `stock: { ... }` de chaque coloris)
- Le prix (`price: 25`)
- Les frais de livraison (`SHIPPING`)
- Ton pseudo Instagram (`INSTAGRAM_HANDLE`)

Après modification, si ton projet est connecté à GitHub, il suffit de
sauvegarder le changement sur GitHub : Vercel republie le site tout seul
en 1-2 minutes.

## 5. Étape suivante : activer le vrai paiement Stripe

Pour l'instant, le formulaire de commande enregistre simplement la commande
(pas de vrai paiement carte). Pour activer Stripe :

1. Crée ton compte sur https://stripe.com
2. Une fois validé, reviens voir Claude avec ton compte créé pour connecter
   Stripe Checkout à la page /commande pour un vrai paiement par carte.

## Besoin d'aide pour le déploiement ?

Si une étape bloque (upload GitHub, erreur Vercel...), montre le message
d'erreur exact pour obtenir de l'aide.
