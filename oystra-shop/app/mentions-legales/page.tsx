import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: true, follow: true },
};

export default function MentionsLegales() {
  return (
    <LegalLayout title="Mentions légales" updated={LEGAL.updatedAt}>
      <section>
        <h2>Éditeur du site</h2>
        <p>
          Le site <strong>{LEGAL.siteName}</strong> est édité par{" "}
          <strong>{LEGAL.ownerName}</strong>, exerçant sous le nom commercial{" "}
          <strong>{LEGAL.brand}</strong> ({LEGAL.tradeName}).
        </p>
        <ul>
          <li>Statut : {LEGAL.status}</li>
          <li>Siège : {LEGAL.address}</li>
          <li>SIRET : {LEGAL.siret}</li>
          <li>{LEGAL.vatMention}</li>
          <li>
            Contact :{" "}
            <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Directeur de la publication</h2>
        <p>{LEGAL.ownerName}.</p>
      </section>

      <section>
        <h2>Hébergement</h2>
        <p>
          Le site est hébergé par <strong>{LEGAL.host.name}</strong>,{" "}
          {LEGAL.host.address} —{" "}
          <a href={LEGAL.host.site} target="_blank" rel="noopener noreferrer">
            {LEGAL.host.site}
          </a>
          . Le nom de domaine est géré par OVH SAS, 2 rue Kellermann, 59100
          Roubaix, France.
        </p>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des éléments du site ({LEGAL.brand}, logo, visuels,
          illustrations, textes, photographies) est la propriété exclusive de
          l&apos;éditeur, sauf mention contraire. Toute reproduction ou
          utilisation sans autorisation écrite préalable est interdite.
        </p>
      </section>

      <section>
        <h2>Données personnelles</h2>
        <p>
          Le traitement des données personnelles est détaillé dans notre{" "}
          <a href="/confidentialite">politique de confidentialité</a>.
          Conformément au RGPD, tu disposes d&apos;un droit d&apos;accès, de
          rectification et de suppression de tes données en écrivant à{" "}
          <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
        </p>
      </section>

      <section>
        <h2>Conditions de vente</h2>
        <p>
          Les ventes réalisées sur le site sont régies par nos{" "}
          <a href="/cgv">conditions générales de vente</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
