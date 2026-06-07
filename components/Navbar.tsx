'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, MapPin } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header style={{position:'sticky',top:0,zIndex:50,background:'var(--color-creme)',borderBottom:'1px solid var(--color-creme-bord)'}}>
      <div style={{maxWidth:'1152px',margin:'0 auto',padding:'0 24px',height:'64px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>

        <Link href="/" style={{display:'flex',alignItems:'center',gap:'6px',textDecoration:'none'}}>
          <MapPin size={18} color="var(--color-terracotta)" />
          <span style={{fontFamily:'var(--font-playfair)',fontSize:'20px',fontWeight:700,color:'var(--color-vert-fonce)'}}>
            Ziguinchor<span style={{color:'var(--color-terracotta)'}}>Immo</span>
          </span>
        </Link>

        <nav style={{display:'flex',gap:'28px'}}>
          {[['Annonces','/annonces'],['Chambres','/annonces?type=chambre'],['Appartements','/annonces?type=appartement'],['Maisons','/annonces?type=maison']].map(([label,href])=>(
            <Link key={href} href={href} style={{fontSize:'14px',color:'var(--color-marron-doux)',textDecoration:'none'}}>{label}</Link>
          ))}
        </nav>

        <div style={{display:'flex',gap:'8px'}}>
          <Link href="/publier" style={{background:'var(--color-terracotta)',color:'#fff',padding:'8px 18px',borderRadius:'8px',fontSize:'14px',fontWeight:500,textDecoration:'none'}}>+ Publier</Link>
          <Link href="/auth/login" style={{background:'var(--color-vert)',color:'#fff',padding:'8px 18px',borderRadius:'8px',fontSize:'14px',fontWeight:500,textDecoration:'none'}}>Connexion</Link>
        </div>
      </div>
    </header>
  )
}
