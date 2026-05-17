'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Publier() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [form, setForm] = useState({
        titre: '',
        description: '',
        prix: '',
        quartier: '',
        type_logement: 'Chambre',
        telephone: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImage(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async () => {
        setLoading(true)
        let image_url = null

        if (image) {
            const fileName = `${Date.now()}_${image.name}`
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(fileName, image)

            if (!uploadError) {
                const { data } = supabase.storage.from('images').getPublicUrl(fileName)
                image_url = data.publicUrl
            }
        }

        const { error } = await supabase.from('annonces').insert([{
            ...form,
            prix: parseInt(form.prix),
            image_url,
            user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        setLoading(false)
        if (!error) {
            alert('Annonce publiée avec succès !')
            router.push('/')
        } else {
            alert('Erreur : ' + error.message)
        }
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
                <a href="/" className="text-2xl font-bold text-green-600">🏠 Ziguinchor Immo</a>
            </nav>

            <div className="max-w-xl mx-auto px-4 py-10">
                <h2 className="text-2xl font-bold mb-6 text-center">Publier une annonce</h2>

                <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
                    <input name="titre" placeholder="Titre (ex: Chambre meublée à Lyndiane)" onChange={handleChange} className="border rounded-xl px-4 py-3 outline-none focus:border-green-500" />

                    <select name="type_logement" onChange={handleChange} className="border rounded-xl px-4 py-3 outline-none focus:border-green-500">
                        <option>Chambre</option>
                        <option>Appartement</option>
                        <option>Maison</option>
                        <option>Studio</option>
                    </select>

                    <input name="quartier" placeholder="Quartier (ex: Lyndiane, Boucotte...)" onChange={handleChange} className="border rounded-xl px-4 py-3 outline-none focus:border-green-500" />

                    <input name="prix" type="number" placeholder="Prix en FCFA / mois" onChange={handleChange} className="border rounded-xl px-4 py-3 outline-none focus:border-green-500" />

                    <input name="telephone" placeholder="Numéro WhatsApp (ex: 771234567)" onChange={handleChange} className="border rounded-xl px-4 py-3 outline-none focus:border-green-500" />

                    <textarea name="description" placeholder="Description du logement..." onChange={handleChange} rows={4} className="border rounded-xl px-4 py-3 outline-none focus:border-green-500" />

                    {/* Upload photo */}
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                        <label className="cursor-pointer">
                            {preview ? (
                                <img src={preview} alt="preview" className="w-full h-48 object-cover rounded-xl" />
                            ) : (
                                <div className="text-gray-400">
                                    <p className="text-4xl">📷</p>
                                    <p>Cliquez pour ajouter une photo</p>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                        </label>
                    </div>

                    <button onClick={handleSubmit} disabled={loading} className="bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-bold">
                        {loading ? 'Publication...' : "Publier l'annonce"}
                    </button>
                </div>
            </div>
        </main>
    )
} 1.
