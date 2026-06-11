'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, MapPin } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--color-creme)', borderBottom: '1px solid var(--color-creme-bord)' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 16px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
          <MapPin size={18} color="var(--color-terracotta)" />
          <span style={{ fontFamily: 'var(--font-playfair)', fontSize: '20px', fontWeight: 700, color: 'var(--color-vert-fonce)' }}>
            Ziguinchor<span style={{ color: 'var(--color-terracotta)' }}>Immo</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: '28px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          {[['Annonces', '/annonces'], ['Chambres', '/annonces?type=chambre'], ['Appartements', '/annonces?type=appartement'], ['Maisons', '/annonces?type=maison']].map(([label, href]) => (
            <Link key={href} href={href} style={{ fontSize: '14px', color: 'var(--color-marron-doux)', textDecoration: 'none', whiteSpace: 'nowrap' }}
              className="hidden-mobile">{label}</Link>
          ))}
        </nav>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link href="/publier" style={{ background: 'var(--color-terracotta)', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}
            className="hidden-mobile">+ Publier</Link>
          <Link href={user ? "/dashboard" : "/auth/login"} style={{ background: 'var(--color-vert)', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}
            className="hidden-mobile">{user ? "Mon espace" : "Connexion"}</Link>
          <button onClick={() => setOpen(!open)} className="show-mobile"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'none' }}>
            {open ? <X size={24} color="var(--color-marron)" /> : <Menu size={24} color="var(--color-marron)" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: 'var(--color-creme)', borderTop: '1px solid var(--color-creme-bord)', padding: '16px' }}>
          {[['Annonces', '/annonces'], ['Chambres', '/annonces?type=chambre'], ['Appartements', '/annonces?type=appartement'], ['Maisons', '/annonces?type=maison']].map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              style={{ display: 'block', padding: '12px 0', fontSize: '15px', color: 'var(--color-marron-doux)', textDecoration: 'none', borderBottom: '1px solid var(--color-creme-bord)' }}>{label}</Link>
          ))}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <Link href="/publier" onClick={() => setOpen(false)} style={{ flex: 1, textAlign: 'center', background: 'var(--color-terracotta)', color: '#fff', padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>+ Publier</Link>
            <Link href={user ? "/dashboard" : "/auth/login"} onClick={() => setOpen(false)} style={{ flex: 1, textAlign: 'center', background: 'var(--color-vert)', color: '#fff', padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>{user ? "Mon espace" : "Connexion"}</Link>
          </div>
        </div>
      )}
    </header>
  )
}