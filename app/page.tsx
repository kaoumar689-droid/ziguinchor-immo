'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

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

const TYPES = ['Tous', 'Chambre', 'Appartement', 'Maison', 'Studio', 'Terrain', 'Bureau']
const QUARTIERS = ['Tous', 'Lyndiane', 'Boucotte', 'Kénia', 'Diabir', 'Kandialang', 'Tilène', 'Santhiaba', 'Colobane', 'Guinaw Rails']

export default function Home() {
  const [annonces, setAnnonces] = useState<Annonce[]>([])
  const [loading, setLoading] = useState(true)
  const [recherche, setRecherche] = useState('')
  const [typeFiltre, setTypeFiltre] = useState('Tous')
  const [quartierFiltre, setQuartierFiltre] = useState('Tous')

  useEffect(() => {
    async function fetchAnnonces() {
      const { data, error } = await supabase
        .from('annonces')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setAnnonces(data || [])
      setLoading(false)
    }
    fetchAnnonces()
  }, [])

  const annoncesFiltrees = annonces.filter(a => {
    const q = recherche.toLowerCase()
    const matchRecherche =
      a.titre.toLowerCase().includes(q) ||
      a.quartier.toLowerCase().includes(q) ||
      (a.description || '').toLowerCase().includes(q)
    const matchType = typeFiltre === 'Tous' || a.type_logement === typeFiltre
    const matchQuartier = quartierFiltre === 'Tous' || a.quartier === quartierFiltre
    return matchRecherche && matchType && matchQuartier
  })

  function resetFiltres() {
    setRecherche('')
    setTypeFiltre('Tous')
    setQuartierFiltre('Tous')
  }

  const filtresActifs = recherche !== '' || typeFiltre !== 'Tous' || quartierFiltre !== 'Tous'

  return (
    <main className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-green-600">🏠 Ziguinchor Immo</h1>
        <div className="flex gap-4 items-center">
          <a href="#annonces" className="text-gray-600 hover:text-green-600 font-medium">
            Annonces
          </a>
          <a
            href="/publier"
            className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 font-medium transition"
          >
            + Publier
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-4 leading-tight">
            Trouvez votre logement à Ziguinchor
          </h2>
          <p className="text-xl mb-10 text-green-100">
            Chambres, appartements, maisons — simple, rapide et gratuit
          </p>

          {/* Barre de recherche */}
          <div className="flex bg-white rounded-2xl overflow-hidden shadow-xl max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Quartier, type de logement, mot-clé..."
              value={recherche}
              onChange={e => setRecherche(e.target.value)}
              className="flex-1 px-5 py-4 text-gray-800 outline-none text-base"
            />
            {recherche && (
              <button
                onClick={() => setRecherche('')}
                className="px-4 text-gray-400 hover:text-gray-600 text-xl"
                aria-label="Effacer la recherche"
              >
                ×
              </button>
            )}
            <button className="bg-green-600 text-white px-8 py-4 hover:bg-green-700 font-bold text-lg transition">
              🔍
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white py-5 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex justify-center gap-12 text-center">
          <div>
            <p className="text-3xl font-bold text-green-600">{annonces.length}</p>
            <p className="text-gray-500 text-sm">Annonces actives</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">100%</p>
            <p className="text-gray-500 text-sm">Gratuit</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">Ziguinchor</p>
            <p className="text-gray-500 text-sm">Ville couverte</p>
          </div>
        </div>
      </section>

      {/* FILTRES */}
      <section id="annonces" className="bg-white border-b border-gray-100 sticky top-[72px] z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 space-y-2">

          {/* Filtre type */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">Type</span>
            {TYPES.map(type => (
              <button
                key={type}
                onClick={() => setTypeFiltre(type)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${
                  typeFiltre === type
                    ? 'bg-green-600 text-white border-green-600'
                    : 'border-green-200 text-green-700 hover:bg-green-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Filtre quartier */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">Quartier</span>
            {QUARTIERS.map(q => (
              <button
                key={q}
                onClick={() => setQuartierFiltre(q)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${
                  quartierFiltre === q
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'border-orange-200 text-orange-700 hover:bg-orange-50'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* RÉSULTATS */}
      <section className="max-w-6xl mx-auto px-4 py-8">

        {/* Compteur + reset */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-gray-700 font-semibold text-lg">
                {annoncesFiltrees.length === 0
                  ? 'Aucune annonce trouvée'
                  : annoncesFiltrees.length === 1
                  ? '1 annonce trouvée'
                  : `${annoncesFiltrees.length} annonces trouvées`}
              </span>
              {filtresActifs && (
                <span className="text-gray-400 text-sm ml-2">
                  {typeFiltre !== 'Tous' && `· ${typeFiltre} `}
                  {quartierFiltre !== 'Tous' && `· ${quartierFiltre} `}
                  {recherche && `· "${recherche}"`}
                </span>
              )}
            </div>
            {filtresActifs && (
              <button
                onClick={resetFiltres}
                className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
              >
                ✕ Réinitialiser les filtres
              </button>
            )}
          </div>
        )}

        {/* Chargement */}
        {loading && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⏳</div>
            <p className="text-gray-500">Chargement des annonces...</p>
          </div>
        )}

        {/* Aucun résultat */}
        {!loading && annoncesFiltrees.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-600 text-xl mb-2">Aucune annonce ne correspond</p>
            <p className="text-gray-400 mb-6">Essayez d'autres filtres ou publiez la première annonce.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={resetFiltres}
                className="border border-green-600 text-green-600 px-6 py-2 rounded-full hover:bg-green-50"
              >
                Effacer les filtres
              </button>
              <a
                href="/publier"
                className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700"
              >
                Publier une annonce
              </a>
            </div>
          </div>
        )}

        {/* Grille annonces */}
        {!loading && annoncesFiltrees.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {annoncesFiltrees.map(annonce => (
              <div
                key={annonce.id}
                className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden group cursor-pointer"
                onClick={() => window.location.href = `/annonces/${annonce.id}`}
              >
                {/* Image */}
                {annonce.image_url ? (
                  <img
                    src={annonce.image_url}
                    alt={annonce.titre}
                    className="w-full h-52 object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-green-50 to-green-100 h-52 flex items-center justify-center text-6xl">
                    🏠
                  </div>
                )}

                <div className="p-5">
                  {/* Badge type */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      {annonce.type_logement}
                    </span>
                    <span className="text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-medium">
                      📍 {annonce.quartier}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg mb-1 line-clamp-2">{annonce.titre}</h3>

                  {annonce.description && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{annonce.description}</p>
                  )}

                  <p className="text-green-600 font-bold text-xl mb-4">
                    {annonce.prix.toLocaleString('fr-SN')} FCFA
                    <span className="text-gray-400 text-sm font-normal"> / mois</span>
                  </p>

                  <a
                    href={`https://wa.me/221${annonce.telephone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="block w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition text-center font-medium text-sm"
                  >
                    📱 Contacter sur WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-white text-center py-8 mt-8">
        <p className="text-lg font-bold text-green-400 mb-2">🏠 Ziguinchor Immo</p>
        <p className="text-gray-400 text-sm">La plateforme immobilière de Ziguinchor — Gratuit pour tous</p>
        <p className="text-gray-500 text-xs mt-2">© {new Date().getFullYear()} Ziguinchor Immo</p>
      </footer>

    </main>
  )
}
