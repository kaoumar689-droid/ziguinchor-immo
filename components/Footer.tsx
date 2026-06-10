import Link from 'next/link'
import { MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-vert-fonce)', color: 'var(--color-vert-clair)', marginTop: '80px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <MapPin size={16} color="var(--color-terracotta-clair)" />
            <span style={{ fontFamily: 'var(--font-playfair)', fontSize: '18px', fontWeight: 700, color: '#FDFAF6' }}>
              Ziguinchor<span style={{ color: 'var(--color-terracotta-clair)' }}>Immo</span>
            </span>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.6, opacity: 0.7 }}>Le marché immobilier local de la Casamance.</p>
        </div>

        <div>
          <h3 style={{ color: '#fff', fontWeight: 500, fontSize: '14px', marginBottom: '16px' }}>Navigation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', opacity: 0.7 }}>
            {[['Annonces', '/annonces'], ['Chambres', '/annonces?type=chambre'], ['Appartements', '/annonces?type=appartement'], ['Maisons', '/annonces?type=maison'], ['Publier', '/publier']].map(([l, h]) => (
              <Link key={h} href={h} style={{ color: 'inherit', textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ color: '#fff', fontWeight: 500, fontSize: '14px', marginBottom: '16px' }}>Quartiers populaires</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', opacity: 0.7 }}>
            {['Boucotte', 'Kandialang', 'Lyndiane', 'Néma', 'Santhiaba'].map(q => (
              <Link key={q} href={`/annonces?quartier=${q}`} style={{ color: 'inherit', textDecoration: 'none' }}>{q}</Link>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', maxWidth: '1152px', margin: '0 auto', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', opacity: 0.5 }}>
        <span>© 2025 ZiguinchorImmo</span>
        <span>Fait avec ❤ en Casamance</span>
      </div>
    </footer>
  )
}
