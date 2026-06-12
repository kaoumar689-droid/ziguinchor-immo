import { useState, useEffect } from 'react'

const KEY = 'ziguinchor_favoris'

export function useFavoris() {
    const [favoris, setFavoris] = useState<string[]>([])

    useEffect(() => {
        const stored = localStorage.getItem(KEY)
        if (stored) setFavoris(JSON.parse(stored))
    }, [])

    const toggleFavori = (id: string) => {
        setFavoris(prev => {
            const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
            localStorage.setItem(KEY, JSON.stringify(next))
            return next
        })
    }

    const isFavori = (id: string) => favoris.includes(id)

    return { favoris, toggleFavori, isFavori }
}