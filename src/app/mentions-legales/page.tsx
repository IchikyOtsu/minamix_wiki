import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MINAMIX — Mentions légales & CGU',
}

export default function MentionsLegalesPage() {
  const year = new Date().getFullYear()

  return (
    <div className="max-w-3xl mx-auto">
      <div className="wiki-page-header">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.12em' }}>
          Mentions légales & CGU
        </h1>
      </div>

      <div className="space-y-6">

        {/* Propriété intellectuelle */}
        <div className="wiki-card p-8">
          <h2 className="wiki-section-title">Propriété intellectuelle</h2>
          <p className="leading-relaxed mb-4">
            L'ensemble du contenu de ce site — y compris, sans s'y limiter, l'univers de fantasy <strong>Minamix</strong>,
            ses races, ses pays, ses entités divines (les Ryximus), son système de magie, ses personnages, ses noms,
            sa cosmologie et tout texte descriptif — est une œuvre de l'esprit originale protégée par le droit d'auteur
            conformément aux articles L111-1 et suivants du Code de la Propriété Intellectuelle français.
          </p>
          <p className="leading-relaxed mb-4">
            <strong>Auteurs et créateurs de l'univers :</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mb-4 ml-2" style={{ color: 'var(--ink)' }}>
            <li><strong>ato_nie</strong> — co-créateur de l'univers Minamix</li>
            <li><strong>fleuve56</strong> — co-créateur de l'univers Minamix</li>
          </ul>
          <p className="leading-relaxed">
            © {year} ato_nie & fleuve56 — Univers Minamix. Tous droits réservés.
          </p>
        </div>

        {/* Droits d'utilisation */}
        <div className="wiki-card p-8">
          <h2 className="wiki-section-title">Droits d'utilisation</h2>
          <p className="leading-relaxed mb-4">
            Toute reproduction, représentation, modification, publication, adaptation ou exploitation de tout ou partie
            du contenu de ce site, quel que soit le moyen ou le procédé utilisé, est <strong>strictement interdite</strong> sans
            l'autorisation écrite préalable des auteurs.
          </p>
          <p className="leading-relaxed mb-4">
            Sont notamment interdits, sans autorisation expresse :
          </p>
          <ul className="list-disc list-inside space-y-1 mb-4 ml-2" style={{ color: 'var(--ink)' }}>
            <li>La copie ou reproduction du lore, des textes et des descriptions à des fins commerciales</li>
            <li>L'utilisation du nom « Minamix » ou de ses personnages/races dans d'autres œuvres publiées</li>
            <li>La revente ou l'exploitation commerciale de tout élément issu de cet univers</li>
            <li>L'entraînement de modèles d'intelligence artificielle sur le contenu de ce site</li>
          </ul>
          <p className="leading-relaxed">
            Une utilisation non commerciale à des fins personnelles (lecture, fan-art non diffusé, notes privées)
            est tolérée dans le respect de l'intégrité de l'œuvre et sous réserve de mentionner les auteurs.
          </p>
        </div>

        {/* Conditions d'accès */}
        <div className="wiki-card p-8">
          <h2 className="wiki-section-title">Conditions d'accès</h2>
          <p className="leading-relaxed mb-4">
            L'accès à ce site est réservé à un usage consultatif. En naviguant sur ce site, vous acceptez les présentes
            conditions. Les auteurs se réservent le droit de modifier à tout moment le contenu du site ainsi que les
            présentes conditions d'utilisation.
          </p>
          <p className="leading-relaxed">
            Les droits d'édition du contenu sont strictement réservés aux auteurs. Toute modification non autorisée
            du contenu constitue une atteinte au droit d'auteur et peut faire l'objet de poursuites.
          </p>
        </div>

        {/* Responsabilité technique */}
        <div className="wiki-card p-8">
          <h2 className="wiki-section-title">Réalisation technique</h2>
          <p className="leading-relaxed">
            La conception et le développement technique de ce site ont été réalisés par <strong>Ichiky_Otsu</strong>.
            Le développeur n'est pas co-auteur du contenu éditorial de l'univers Minamix et n'en détient aucun droit
            de propriété intellectuelle.
          </p>
        </div>

        {/* Contact */}
        <div className="wiki-card p-8">
          <h2 className="wiki-section-title">Contact</h2>
          <p className="leading-relaxed">
            Pour toute demande relative à l'utilisation du contenu, un partenariat ou un signalement de violation
            des droits, vous pouvez contacter les auteurs via Discord : <strong>ato_nie</strong> ou <strong>fleuve56</strong>.
          </p>
        </div>

        <p className="text-center text-xs pb-4" style={{ color: 'var(--ink-muted)' }}>
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

      </div>
    </div>
  )
}
