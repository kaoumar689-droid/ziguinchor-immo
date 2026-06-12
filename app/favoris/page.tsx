'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import PropertyCard, { Property } from '@/components/PropertyCard'
import { useFavoris } from '@/lib/useFavoris'
import { Heart } from 'lucide-react'

export default function FavorisPage() {
    const { favoris } = useFavoris()
    const [annonces, setAnnonces] = useState<Property[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (favoris.length === 0) { setLoading(false); return }
        supabase
            .from('annonces')
            .select('*')
            .in('id', favoris)
            .then(({ data }) => {
                setAnnonces((data ?? []).map((a: any) => ({
                    id: a.id,
                    titre: a.titre,
                    prix: a.prix,
                    type: a.type_logement?.toLowerCase(),
                    quartier: a.quartier,
                    telephone: a.telephone,
                    images: a.image_url ? [a.image_url] : [],
                })))
                setLoading(false)
            })
    }, [favoris])

    return (
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                <Heart size={24} fill="var(--color-terracotta)" color="var(--color-terracotta)" />
                <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '26px', color: 'var(--color-marron)', margin: 0 }}>
                    Mes favoris
                </h1>
                <span style={{ background: 'var(--color-creme-sombre)', color: 'var(--color-marron-muted)', borderRadius: '20px', padding: '2px 10px', fontSize: '13px' }}>
                    {favoris.length}
                </span>
            </div>

            {loading ? (
                <p style={{ color: 'var(--color-marron-muted)' }}>Chargement...</p>
            ) : favoris.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-marron-muted)' }}>
                    <Heart size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                    <p style={{ fontSize: '16px' }}>Aucun favori pour le moment</p>
                    <p style={{ fontSize: '13px' }}>Clique sur ❤️ sur une annonce pour la sauvegarder</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {annonces.map(a => <PropertyCard key={a.id} property={a} />)}
                </div>
            )}
        </main>
    )
}