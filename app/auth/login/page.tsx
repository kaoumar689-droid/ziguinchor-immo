'use client'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleLogin() {
        setLoading(true)
        setError('')
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            setError('Email ou mot de passe incorrect')
        } else {
            router.push('/')
        }
        setLoading(false)
    }

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-600">🏠 Ziguinchor Immo</h1>
                    <p className="text-gray-500 mt-2">Connectez-vous à votre compte</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>
                )}

                <div className="space-y-4">
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
                            placeholder="••••••••"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500"
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </div>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Pas encore de compte ?{' '}
                    <a href="/auth/inscription" className="text-green-600 font-medium hover:underline">
                        S'inscrire
                    </a>
                </p>
                <p className="text-center mt-3">
                    <a href="/" className="text-gray-400 text-sm hover:text-gray-600">← Retour à l'accueil</a>
                </p>
            </div>
        </main>
    )
}