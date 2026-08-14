import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  robots: { index: true, follow: true },
};

export default function CGV() {
  return (
    <LegalLayout title="Conditions générales de vente" updated={LEGAL.updatedAt}>
      <section>
        <h2>1. Objet</h2>
        <p>
          Les présentes conditions générales de vente (CGV) régissent les ventes
          de vêtements de la marque <strong>{LEGAL.brand}</strong> conclues sur
          le site <strong>{LEGAL.siteName}</strong> entre l&apos;éditeur —{" "}
          {LEGAL.ownerName}, {LEGAL.status}, SIRET {LEGAL.siret} — et tout client
          particulier majeur (« le client »). Toute commande implique
          l&apos;acceptation sans réserve des présentes CGV.
        </p>
      </section>

      <section>
        <h2>2. Produits</h2>
        <p>
          Les produits proposés sont des t-shirts en série limitée, designés à la
          main sur l&apos;île d&apos;Oléron et produits en atelier partenaire
          (broderie du logo sur le torse, sérigraphie au dos). Les photographies
          sont les plus fidèles possibles ; de légères variations de teinte
          peuvent exister selon les écrans. Les produits sont proposés dans la
          limite des stocks disponibles.
        </p>
      </section>

      <section>
        <h2>3. Prix</h2>
        <p>
          Les prix sont indiqués en euros, toutes taxes comprises (TTC).{" "}
          <strong>{LEGAL.vatMention}.</strong> Les frais de livraison sont
          indiqués avant la validation de la commande et s&apos;ajoutent au prix
          des produits. L&apos;éditeur se réserve le droit de modifier ses prix à
          tout moment, les produits étant facturés sur la base des tarifs en
          vigueur au moment de la commande.
        </p>
      </section>

      <section>
        <h2>4. Commande</h2>
        <p>
          Le client sélectionne ses articles, renseigne ses coordonnées et son
          mode de livraison, puis valide sa commande. La validation vaut
          conclusion du contrat (« commande avec obligation de paiement »). Un
          email de confirmation récapitulant la commande est adressé au client.
        </p>
      </section>

      <section>
        <h2>5. Paiement</h2>
        <p>
          Le paiement s&apos;effectue en ligne par carte bancaire via notre
          prestataire sécurisé <strong>Stripe</strong>. La commande n&apos;est
          traitée qu&apos;après confirmation du paiement. Aucune donnée bancaire
          n&apos;est conservée par l&apos;éditeur.
        </p>
      </section>

      <section>
        <h2>6. Livraison</h2>
        <p>Les modes de livraison proposés sont :</p>
        <ul>
          <li>
            <strong>Point Relais (Mondial Relay)</strong> — {LEGAL.deliveryDelay},
            {" "}4,90 €.
          </li>
          <li>
            <strong>Livraison à domicile (Mondial Relay)</strong> —{" "}
            {LEGAL.deliveryDelay}, 6,90 €.
          </li>
          <li>
            <strong>Retrait en main propre</strong> à Saint-Denis-d&apos;Oléron —
            gratuit, sur rendez-vous.
          </li>
        </ul>
        <p>
          Les commandes sont expédiées sous {LEGAL.dispatchDelay}. Un numéro de
          suivi est communiqué par email dès l&apos;expédition. Les délais sont
          indicatifs ; l&apos;éditeur ne saurait être tenu responsable des
          retards imputables au transporteur. En cas de colis endommagé ou
          perdu, le client contacte l&apos;éditeur à{" "}
          <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> afin qu&apos;une
          solution soit trouvée (renvoi ou remboursement).
        </p>
      </section>

      <section>
        <h2>7. Droit de rétractation</h2>
        <p>
          Conformément aux articles L221-18 et suivants du Code de la
          consommation, le client dispose d&apos;un délai de{" "}
          <strong>14 jours</strong> à compter de la réception des produits pour
          exercer son droit de rétractation, sans avoir à motiver sa décision.
        </p>
        <p>
          Pour l&apos;exercer, le client informe l&apos;éditeur de sa décision
          par email à <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> avant
          l&apos;expiration du délai. Les produits doivent être retournés neufs,
          non portés (hors essayage) et dans leur état d&apos;origine, dans les
          14 jours suivant la notification. Les frais de retour sont à la charge
          du client. Le remboursement (produits + frais de livraison standard)
          intervient dans les 14 jours suivant la récupération des produits, par
          le même moyen de paiement.
        </p>
      </section>

      <section>
        <h2>8. Garanties légales</h2>
        <p>
          Indépendamment de toute garantie commerciale, l&apos;éditeur reste tenu
          de la <strong>garantie légale de conformité</strong> (art. L217-3 et
          suivants du Code de la consommation), d&apos;une durée de deux ans, et
          de la garantie contre les <strong>vices cachés</strong> (art. 1641 et
          suivants du Code civil). En cas de défaut, le client contacte
          l&apos;éditeur à{" "}
          <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
        </p>
      </section>

      <section>
        <h2>9. Données personnelles</h2>
        <p>
          Les données collectées sont nécessaires au traitement des commandes et
          traitées conformément à notre{" "}
          <a href="/confidentialite">politique de confidentialité</a>.
        </p>
      </section>

      <section>
        <h2>10. Litiges & médiation</h2>
        <p>
          Les présentes CGV sont soumises au droit français. En cas de litige, le
          client peut recourir gratuitement à un médiateur de la consommation. La
          plateforme européenne de règlement en ligne des litiges est accessible
          à{" "}
          <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
            ec.europa.eu/consumers/odr
          </a>
          . À défaut d&apos;accord amiable, les tribunaux français sont
          compétents.
        </p>
      </section>
    </LegalLayout>
  );
}
