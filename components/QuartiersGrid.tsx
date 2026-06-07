import Link from 'next/link'

const QUARTIERS = [
  { nom: 'Boucotte', couleur: '#1A5C3A', priorite: 'haute' },
  { nom: 'Kandialang', couleur: '#2E7D4F', priorite: 'haute' },
  { nom: 'Lyndiane', couleur: '#C4622D', priorite: 'haute' },
  { nom: 'Santhiaba', couleur: '#8A6A3A', priorite: 'haute' },
  { nom: 'Néma', couleur: '#4A7A5A', priorite: 'haute' },
  { nom: 'Colobane', couleur: '#4A6A8A', priorite: 'haute' },
  { nom: 'Tilène', couleur: '#6A5A3A', priorite: 'moyenne' },
  { nom: 'Diabir', couleur: '#5A6A4A', priorite: 'moyenne' },
  { nom: 'Boudody', couleur: '#7A4A3A', priorite: 'moyenne' },
  { nom: 'Djibelor', couleur: '#3A6A7A', priorite: 'moyenne' },
  { nom: 'Kénia', couleur: '#5A7A4A', priorite: 'moyenne' },
  { nom: 'Goumel', couleur: '#7A5A4A', priorite: 'moyenne' },
  { nom: 'Soucoupapaye', couleur: '#4A5A6A', priorite: 'moyenne' },
  { nom: 'Escale', couleur: '#6A4A5A', priorite: 'moyenne' },
  { nom: 'Boukot', couleur: '#3A5A4A', priorite: 'moyenne' },
  { nom: 'Kansahoudy', couleur: '#5A4A6A', priorite: 'moyenne' },
]

export default function QuartiersGrid() {
  const hauts = QUARTIERS.filter(q => q.priorite === 'haute')
  const moyens = QUARTIERS.filter(q => q.priorite === 'moyenne')

  return (
    <section style={{maxWidth:'1152px',margin:'0 auto',padding:'0 24px 56px'}}>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'24px'}}>
        <div>
          <h2 style={{fontFamily:'var(--font-playfair)',fontSize:'28px',fontWeight:700,color:'#1A3020'}}>
            Explorer par <span style={{color:'var(--color-terracotta)'}}>quartier</span>
          </h2>
          <p style={{fontSize:'13px',color:'var(--color-marron-muted)',marginTop:'4px'}}>16 quartiers couverts à Ziguinchor</p>
        </div>
        <Link href="/annonces" style={{fontSize:'13px',color:'var(--color-vert)',fontWeight:500,textDecoration:'none'}}>Voir tout →</Link>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'10px',marginBottom:'10px'}}>
        {hauts.map(q => (
          <Link key={q.nom} href={`/annonces?quartier=${encodeURIComponent(q.nom)}`}
            style={{borderRadius:'12px',overflow:'hidden',height:'90px',position:'relative',display:'block',background:q.couleur,textDecoration:'none'}}>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)'}} />
            <div style={{position:'absolute',bottom:0,left:0,padding:'10px'}}>
              <p style={{fontFamily:'var(--font-playfair)',fontSize:'13px',fontWeight:700,color:'#fff',margin:0}}>{q.nom}</p>
            </div>
          </Link>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'10px'}}>
        {moyens.map(q => (
          <Link key={q.nom} href={`/annonces?quartier=${encodeURIComponent(q.nom)}`}
            style={{borderRadius:'10px',overflow:'hidden',height:'64px',position:'relative',display:'block',background:q.couleur,textDecoration:'none'}}>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)'}} />
            <div style={{position:'absolute',bottom:0,left:0,padding:'8px'}}>
              <p style={{fontFamily:'var(--font-playfair)',fontSize:'11px',fontWeight:700,color:'#fff',margin:0}}>{q.nom}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
