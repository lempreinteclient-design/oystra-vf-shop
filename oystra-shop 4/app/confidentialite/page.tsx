import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: true, follow: true },
};

export default function Confidentialite() {
  return (
    <LegalLayout title="Politique de confidentialité" updated={LEGAL.updatedAt}>
      <section>
        <h2>Responsable du traitement</h2>
        <p>
          {LEGAL.ownerName} ({LEGAL.brand}), {LEGAL.address}. Contact :{" "}
          <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
        </p>
      </section>

      <section>
        <h2>Données collectées</h2>
        <p>Dans le cadre d&apos;une commande, nous collectons :</p>
        <ul>
          <li>identité : nom, prénom ;</li>
          <li>coordonnées : email, téléphone ;</li>
          <li>livraison : adresse postale ou point relais, ville, code postal ;</li>
          <li>commande : produits, tailles, montants ;</li>
          <li>
            paiement : traité directement par Stripe — aucune donnée bancaire
            n&apos;est stockée par nos soins.
          </li>
        </ul>
      </section>

      <section>
        <h2>Finalités & base légale</h2>
        <p>
          Ces données servent à traiter et expédier les commandes, à établir les
          factures, à assurer le suivi et le service client. La base légale est
          l&apos;exécution du contrat de vente et le respect de nos obligations
          légales (facturation, comptabilité).
        </p>
      </section>

      <section>
        <h2>Destinataires</h2>
        <p>
          Les données ne sont jamais vendues. Elles sont transmises uniquement
          aux prestataires nécessaires à la commande :
        </p>
        <ul>
          <li><strong>Stripe</strong> — paiement sécurisé ;</li>
          <li>
            <strong>Mondial Relay</strong> (via Boxtal) — livraison et suivi ;
          </li>
          <li><strong>Vercel</strong> — hébergement du site.</li>
        </ul>
      </section>

      <section>
        <h2>Durée de conservation</h2>
        <p>
          Les données de commande sont conservées le temps de la relation
          commerciale, puis archivées pour répondre à nos obligations légales
          (les factures sont conservées 10 ans conformément à la loi).
        </p>
      </section>

      <section>
        <h2>Tes droits</h2>
        <p>
          Conformément au RGPD, tu disposes d&apos;un droit d&apos;accès, de
          rectification, d&apos;effacement, de limitation, d&apos;opposition et de
          portabilité de tes données. Pour les exercer, écris à{" "}
          <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>. Tu peux aussi
          introduire une réclamation auprès de la CNIL (
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
            cnil.fr
          </a>
          ).
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          Le site n&apos;utilise pas de cookies publicitaires ni de traceurs de
          mesure d&apos;audience. Seuls des cookies strictement nécessaires au
          fonctionnement (panier, paiement Stripe) peuvent être déposés ; ils ne
          requièrent pas de consentement.
        </p>
      </section>
    </LegalLayout>
  );
}
