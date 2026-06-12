'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

type Annonce = {
    id: string
    titre: string
    description: string
    quartier: string
    prix: number
    type_logement: string
    telephone: string
    image_url: string | null
    created_at: string
}

export default function DetailAnnonce() {
    const { id } = useParams()
    const router = useRouter()
    const [annonce, setAnnonce] = useState<Annonce | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        async function fetchAnnonce() {
            const { data, error } = await supabase
                .from('annonces')
                .select('*')
                .eq('id', id)
                .single()

            if (error || !data) {
                setNotFound(true)
            } else {
                setAnnonce(data)
            }
            supabase.from('annonces').update({ vues: (data.vues || 0) + 1 }).eq('id', id).then(() => { })
            setLoading(false)
        }
        if (id) fetchAnnonce()
    }, [id])

    const whatsappLink = annonce
        ? 'https://wa.me/221' + annonce.telephone.replace(/\D/g, '') + '?text=' + encodeURIComponent(
            'Bonjour, je suis intéressé(e) par votre annonce "' + annonce.titre + '" à ' + annonce.quartier + ' — ' + annonce.prix.toLocaleString('fr-SN') + ' FCFA/mois'
        )
        : '#'

    const partageWhatsappLink = annonce
        ? 'https://wa.me/?text=' + encodeURIComponent(
            annonce.titre + ' — ' + annonce.prix.toLocaleString('fr-SN') + ' FCFA/mois à ' + annonce.quartier + ' 🏠\n' + (typeof window !== 'undefined' ? window.location.href : '')
        )
        : '#'

    if (loading) return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="text-5xl mb-4 animate-bounce">⏳</div>
                <p className="text-gray-500">Chargement de l'annonce...</p>
            </div>
        </main>
    )

    if (notFound) return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="text-6xl mb-4">🏚️</div>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Annonce introuvable</h2>
                <p className="text-gray-400 mb-6">Cette annonce n'existe pas ou a été supprimée.</p>
                <button onClick={() => router.push('/')} className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition">
                    ← Retour aux annonces
                </button>
            </div>
        </main>
    )

    if (!annonce) return null

    return (
        <main className="min-h-screen bg-gray-50">

            <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <button onClick={() => router.push('/')} className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium">
                    ← Retour
                </button>
                <h1 className="text-xl font-bold text-green-600">🏠 Ziguinchor Immo</h1>
                <a href="/publier" className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 font-medium transition text-sm">
                    + Publier
                </a>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-8">

                <div className="rounded-2xl overflow-hidden shadow-lg mb-8 bg-gray-100">
                    {annonce.image_url ? (
                        <img src={annonce.image_url} alt={annonce.titre} className="w-full h-80 object-cover" />
                    ) : (
                        <div className="h-80 flex items-center justify-center text-8xl bg-gradient-to-br from-green-50 to-green-100">🏠</div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <div className="flex gap-2 flex-wrap mb-3">
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">{annonce.type_logement}</span>
                                <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">📍 {annonce.quartier}, Ziguinchor</span>
                                <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm">
                                    Publié le {new Date(annonce.created_at).toLocaleDateString('fr-SN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 leading-tight">{annonce.titre}</h2>
                        </div>

                        <div className="bg-green-50 rounded-2xl p-5">
                            <p className="text-sm text-green-700 font-medium mb-1">Loyer mensuel</p>
                            <p className="text-4xl font-bold text-green-600">
                                {annonce.prix.toLocaleString('fr-SN')}
                                <span className="text-lg font-normal text-green-500"> FCFA / mois</span>
                            </p>
                        </div>

                        {annonce.description && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-800 text-lg mb-3">📋 Description</h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{annonce.description}</p>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-gray-800 text-lg mb-4">📊 Détails</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Type</p>
                                    <p className="font-semibold text-gray-800">{annonce.type_logement}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Quartier</p>
                                    <p className="font-semibold text-gray-800">{annonce.quartier}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Ville</p>
                                    <p className="font-semibold text-gray-800">Ziguinchor</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Prix</p>
                                    <p className="font-semibold text-green-600">{annonce.prix.toLocaleString('fr-SN')} FCFA</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                            <h3 className="font-bold text-gray-800 text-lg mb-4">📞 Contacter le propriétaire</h3>
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition text-lg mb-3">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                                </svg>
                                WhatsApp
                            </a>
                            <a href={'tel:' + annonce.telephone} className="flex items-center justify-center gap-2 w-full border-2 border-green-600 text-green-600 hover:bg-green-50 font-bold py-3 px-6 rounded-xl transition">
                                📞 {annonce.telephone}
                            </a>
                            <p className="text-xs text-gray-400 text-center mt-4">Mentionnez Ziguinchor Immo lors de votre contact</p>
                        </div>

                        {/* Partager */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm">
                            <h3 className="font-semibold text-gray-700 mb-3">🔗 Partager cette annonce</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <a href={partageWhatsappLink} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl text-sm font-medium text-white"
                                    style={{ background: '#25D366' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                                    </svg>
                                    Partager sur WhatsApp
                                </a>
                                <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Lien copié !') }}
                                    className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 py-2 px-4 rounded-xl transition text-sm">
                                    📋 Copier le lien
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="bg-gray-800 text-white text-center py-8 mt-12">
                <p className="text-lg font-bold text-green-400 mb-2">🏠 Ziguinchor Immo</p>
                <p className="text-gray-400 text-sm">La plateforme immobilière de Ziguinchor — Gratuit pour tous</p>
                <p className="text-gray-500 text-xs mt-2">© {new Date().getFullYear()} Ziguinchor Immo</p>
            </footer>
        </main>
    )
}