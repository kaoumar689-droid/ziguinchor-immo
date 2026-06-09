import Link from 'next/link'
import { MapPin } from 'lucide-react'
import PropertyCard from '@/components/PropertyCard'
import QuartiersGrid from '@/components/QuartiersGrid'
import { supabase } from '@/lib/supabase'
export const dynamic = 'force-dynamic'

async function getData() {
  const { data, count } = await supabase
    .from('annonces')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(6)

  const properties = (data ?? []).map((a: any) => ({
    id: a.id,
    titre: a.titre,
    prix: a.prix,
    type: a.type_logement?.toLowerCase(),
    quartier: a.quartier,
    telephone: a.telephone,
    images: a.image_url ? [a.image_url] : [],
    chambres: 1,
  }))

  return { properties, total: count ?? 0 }
}

export default async function HomePage() {
  const { properties, total } = await getData()

  return (
    <>
      <section style={{ position: 'relative', minHeight: '520px', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'var(--color-vert-fonce)' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)', backgroundSize: '24px 24px' }} />
        <div style={{ position: 'absolute', right: '-60px', top: '-60px', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--color-terracotta)', opacity: 0.12 }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1152px', margin: '0 auto', padding: '60px 24px', width: '100%' }}>
          <div style={{ maxWidth: '540px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(196,98,45,0.25)', border: '1px solid rgba(196,98,45,0.4)', color: 'var(--color-terracotta-clair)', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, marginBottom: '20px' }}>
              <MapPin size={13} />
              Ziguinchor, Casamance
            </div>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '44px', fontWeight: 700, color: 'var(--color-creme)', lineHeight: 1.18, marginBottom: '16px' }}>
              Trouvez votre<br />
              <em style={{ fontStyle: 'italic', color: 'var(--color-terracotta-clair)' }}>chez-vous</em><br />
              en Casamance
            </h1>
            <p style={{ color: 'var(--color-vert-clair)', fontSize: '15px', lineHeight: 1.65, marginBottom: '28px', opacity: 0.85 }}>
              Chambres, appartements, maisons — les meilleures annonces du marché local.
            </p>
            <form action="/annonces" method="GET">
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-creme)', borderRadius: '12px', padding: '6px 6px 6px 14px', gap: '8px', maxWidth: '480px' }}>
                <input name="q" type="text" placeholder="Quartier, type de logement…" style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '13px', fontFamily: 'var(--font-dm)', color: 'var(--color-marron)', outline: 'none' }} />
                <select name="type" style={{ background: 'var(--color-creme-sombre)', border: 'none', borderRadius: '8px', padding: '7px 10px', fontSize: '12px', fontFamily: 'var(--font-dm)', color: 'var(--color-marron-doux)', outline: 'none' }}>
                  <option value="">Tous types</option>
                  <option value="chambre">Chambre</option>
                  <option value="appartement">Appartement</option>
                  <option value="maison">Maison</option>
                </select>
                <button type="submit" style={{ background: 'var(--color-terracotta)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '9px', fontSize: '13px', fontWeight: 500, fontFamily: 'var(--font-dm)', cursor: 'pointer' }}>
                  Chercher
                </button>
              </div>
            </form>
            <div style={{ display: 'flex', gap: '32px', marginTop: '28px' }}>
              {[
                { val: total > 0 ? `${total}+` : '—', label: 'Annonces actives' },
                { val: '16', label: 'Quartiers couverts' },
                { val: '100%', label: 'Marché local' },
              ].map(({ val, label }) => (
                <div key={label}>
                  <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '22px', fontWeight: 700, color: 'var(--color-creme)' }}>{val}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-vert-clair)', marginTop: '2px', opacity: 0.7 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1152px', margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: 700, color: '#1A3020' }}>
              Annonces <span style={{ color: 'var(--color-terracotta)' }}>récentes</span>
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--color-marron-muted)', marginTop: '4px' }}>Les logements ajoutés cette semaine</p>
          </div>
          <Link href="/annonces" style={{ fontSize: '13px', color: 'var(--color-vert)', fontWeight: 500, textDecoration: 'none' }}>Voir tout →</Link>
        </div>
        {properties.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
            {properties.map((p: any) => <PropertyCard key={p.id} property={p} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-marron-muted)' }}>
            <p style={{ fontWeight: 500, marginBottom: '8px' }}>Aucune annonce pour le moment</p>
            <Link href="/publier" style={{ background: 'var(--color-terracotta)', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}>
              Publier la première
            </Link>
          </div>
        )}
      </section>

      <QuartiersGrid />

      <section style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ position: 'relative', background: 'var(--color-vert)', borderRadius: '16px', padding: '44px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-20px', bottom: '-30px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '24px', fontWeight: 700, color: 'var(--color-creme)', marginBottom: '8px' }}>Vous louez un logement ?</h2>
            <p style={{ fontSize: '14px', color: 'var(--color-vert-clair)', opacity: 0.8, maxWidth: '380px' }}>Publiez gratuitement et touchez des milliers d'étudiants et de familles à Ziguinchor.</p>
          </div>
          <Link href="/publier" style={{ position: 'relative', zIndex: 1, background: 'var(--color-terracotta)', color: '#fff', padding: '14px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Publier une annonce
          </Link>
        </div>
      </section>
    </>
  )
}