cat > 'app/auth/inscription/page.tsx' << 'EOF'
'use client'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Inscription() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nom, setNom] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    async function handleInscription() {
        setLoading(true)
        setError('')
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: nom } }
        })
        if (error) {
            setError(error.message)
        } else {
            setSuccess(true)
        }
        setLoading(false)
    }

    if (success) return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Inscription réussie !</h2>
                <p className="text-gray-500 mb-6">Vérifiez votre email pour confirmer votre compte.</p>
                <a href="/auth/login" className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 inline-block font-medium">
                    Se connecter
                </a>
            </div>
        </main>
    )

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-600">🏠 Ziguinchor Immo</h1>
                    <p className="text-gray-500 mt-2">Créez votre compte gratuitement</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                        <input
                            type="text"
                            value={nom}
                            onChange={e => setNom(e.target.value)}
                            placeholder="Seydina Fall"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="votre@email.com"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Minimum 6 caractères"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500"
                        />
                    </div>

                    <button
                        onClick={handleInscription}
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Inscription...' : "S'inscrire"}
                    </button>
                </div>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Déjà un compte ?{' '}
                    <a href="/auth/login" className="text-green-600 font-medium hover:underline">
                        Se connecter
                    </a>
                </p>
            </div>
        </main>
    )
}