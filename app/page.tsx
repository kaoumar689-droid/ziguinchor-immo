'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Annonce = {
  id: string
  titre: string
  quartier: string
  prix: number
  type_logement: string
  telephone: string
}

export default function Home() {
  const [annonces, setAnnonces] = useState<Annonce[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnnonces() {
      const { data } = await supabase.from('annonces').select('*').order('created_at', { ascending: false })
      setAnnonces(data || [])
      setLoading(false)
    }
    fetchAnnonces()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600">🏠 Ziguinchor Immo</h1>
        <div className="flex gap-4">
          <a href="#" className="text-gray-600 hover:text-green-600">Accueil</a>
          <a href="#" className="text-gray-600 hover:text-green-600">Annonces</a>
          <a href="/publier" className="bg-green-600 text-white px-4 py-1 rounded-full hover:bg-green-700">Publier</a>
        </div>
      </nav>

      <section className="bg-green-600 text-white text-center py-20 px-4">
        <h2 className="text-4xl font-bold mb-4">Trouvez votre logement à Ziguinchor</h2>
        <p className="text-lg mb-8">Chambres, appartements, maisons — simple, rapide et gratuit</p>
        <div className="flex justify-center gap-2 max-w-xl mx-auto">
          <input type="text" placeholder="Quartier, type de logement..." className="flex-1 px-4 py-3 rounded-l-full text-gray-800 outline-none" />
          <button className="bg-white text-green-600 font-bold px-6 py-3 rounded-r-full hover:bg-gray-100">Rechercher</button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <p className="text-center text-gray-500">Chargement des annonces...</p>
        ) : annonces.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">Aucune annonce pour le moment</p>
            <a href="/publier" className="mt-4 inline-block bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700">Publier la première annonce</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {annonces.map((annonce) => (
              <div key={annonce.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
                <div className="bg-gray-200 h-48 flex items-center justify-center text-4xl">🏠</div>
                <div className="p-4">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{annonce.type_logement}</span>
                  <h3 className="font-bold text-lg mt-2">{annonce.titre}</h3>
                  <p className="text-gray-500 text-sm">📍 {annonce.quartier}, Ziguinchor</p>
                  <p className="text-green-600 font-bold mt-2">{annonce.prix.toLocaleString()} FCFA / mois</p>
                  <a href={`https://wa.me/221${annonce.telephone}`} target="_blank" className="mt-3 block w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition text-center">
                    Contacter sur WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}