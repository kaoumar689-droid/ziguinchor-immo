import Image from 'next/image'
import Link from 'next/link'
import { MapPin, BedDouble, Wifi, Zap, Droplets, Car, Bath } from 'lucide-react'

export type Property = {
  id: string
  titre: string
  prix: number
  type: string
  quartier: string
  chambres?: number
  images?: string[]
  features?: string[]
  telephone?: string
}

const TYPE_LABELS: Record<string, string> = {
  chambre: 'Chambre',
  appartement: 'Appartement',
  maison: 'Maison',
}

const TYPE_COLORS: Record<string, string> = {
  chambre: 'var(--color-vert)',
  appartement: 'var(--color-vert-moyen)',
  maison: 'var(--color-terracotta)',
}

export default function PropertyCard({ property }: { property: Property }) {
  const imageUrl = property.images?.[0] ?? null
  const waLink = property.telephone
    ? `https://wa.me/221${property.telephone.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour, je suis intéressé(e) par "${property.titre}" à ${property.quartier}`)}`
    : null
  const typeKey = property.type?.toLowerCase() ?? 'chambre'

  return (
    <article style={{ background: '#fff', borderRadius: '14px', border: '1px solid var(--color-creme-bord)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '180px', position: 'relative', background: 'var(--color-creme-sombre)' }}>
        {imageUrl ? (
          <Image src={imageUrl} alt={property.titre} fill style={{ objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-marron-pale)', fontSize: '13px' }}>
            Pas de photo
          </div>
        )}
        <span style={{ position: 'absolute', top: '10px', left: '10px', background: TYPE_COLORS[typeKey] ?? 'var(--color-vert)', color: '#fff', fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '6px' }}>
          {TYPE_LABELS[typeKey] ?? property.type}
        </span>
      </div>

      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '18px', fontWeight: 700, color: 'var(--color-marron)' }}>
          {property.prix?.toLocaleString('fr-FR')}
          <span style={{ fontFamily: 'var(--font-dm)', fontSize: '12px', fontWeight: 400, color: 'var(--color-marron-muted)', marginLeft: '4px' }}>FCFA/mois</span>
        </div>
        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-marron)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {property.titre}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-marron-muted)' }}>
          <MapPin size={12} color="var(--color-terracotta)" />
          {property.quartier}
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <Link href={`/annonces/${property.id}`} style={{ flex: 1, textAlign: 'center', fontSize: '13px', fontWeight: 500, color: 'var(--color-vert)', border: '1px solid var(--color-vert)', borderRadius: '8px', padding: '8px', textDecoration: 'none' }}>
            Voir détails
          </Link>
          {waLink && (
            <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: 'center', fontSize: '13px', fontWeight: 500, background: '#25D366', color: '#fff', borderRadius: '8px', padding: '8px', textDecoration: 'none' }}>
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </article>
  )
}