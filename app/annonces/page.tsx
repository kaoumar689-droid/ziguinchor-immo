import { createClient } from '@supabase/supabase-js'
import PropertyCard from '@/components/PropertyCard'
import Link from 'next/link'

const QUARTIERS = [
    'Boucotte', 'Kandialang', 'Lyndiane', 'Santhiaba', 'Néma', 'Colobane',
    'Tilène', 'Diabir', 'Boudody', 'Djibelor', 'Kénia', 'Goumel',
    'Soucoupapaye', 'Escale', 'Boukot', 'Kansahoudy'
]

async function getProperties(type?: string, quartier?: string, q?: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    let query = supabase.from('properties').select('*').order('created_at', { ascending: false })
    if (type) query = query.eq('type', type)
    if (quartier) query = query.eq('quartier', quartier)
    if (q) query = query.ilike('titre', `%${q}%`)
    const { data } = await query
    return data ?? []
}

export default async function AnnoncesPage({
    searchParams,
}: {
    searchParams: Promise<{ type?: string; quartier?: string; q?: string }>
}) {
    const params = await searchParams
    const properties = await getProperties(params.type, params.quartier, params.q)

    return (
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '40px 24px' }}>

            {/* Titre */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '32px', fontWeight: 700, color: '#1A3020' }}>
                    Toutes les <span style={{ color: 'var(--color-terracotta)' }}>annonces</span>
                </h1>
                <p style={{ fontSize: '13px', color: 'var(--color-marron-muted)', marginTop: '4px' }}>
                    {properties.length} logement{properties.length !== 1 ? 's' : ''} disponible{properties.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Filtres */}
            <form method="GET" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px', padding: '16px', background: '#fff', borderRadius: '12px', border: '1px solid var(--color-creme-bord)' }}>
                <input
                    name="q"
                    defaultValue={params.q}
                    placeholder="Rechercher..."
                    style={{ flex: 1, minWidth: '160px', border: '1px solid var(--color-creme-bord)', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontFamily: 'var(--font-dm)', outline: 'none' }}
                />
                <select name="type" defaultValue={params.type ?? ''}
                    style={{ border: '1px solid var(--color-creme-bord)', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontFamily: 'var(--font-dm)', outline: 'none', background: '#fff' }}>
                    <option value="">Tous types</option>
                    <option value="chambre">Chambre</option>
                    <option value="appartement">Appartement</option>
                    <option value="maison">Maison</option>
                </select>
                <select name="quartier" defaultValue={params.quartier ?? ''}
                    style={{ border: '1px solid var(--color-creme-bord)', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontFamily: 'var(--font-dm)', outline: 'none', background: '#fff' }}>
                    <option value="">Tous quartiers</option>
                    {QUARTIERS.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
                <button type="submit"
                    style={{ background: 'var(--color-vert)', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, fontFamily: 'var(--font-dm)', cursor: 'pointer' }}>
                    Filtrer
                </button>
                {(params.type || params.quartier || params.q) && (
                    <Link href="/annonces"
                        style={{ border: '1px solid var(--color-creme-bord)', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', color: 'var(--color-marron-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        Effacer
                    </Link>
                )}
            </form>

            {/* Grille */}
            {properties.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
                    {properties.map((p: any) => <PropertyCard key={p.id} property={p} />)}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-marron-muted)' }}>
                    <p style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>Aucun logement trouvé</p>
                    <p style={{ fontSize: '13px', marginBottom: '20px' }}>Essayez d'autres filtres</p>
                    <Link href="/annonces" style={{ background: 'var(--color-terracotta)', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}>
                        Voir tout
                    </Link>
                </div>
            )}
        </div>
    )
}