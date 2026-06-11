'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Annonce = {
  id: string
  titre: string
  Prix: number
  type_logement: string
  Quartier: string
  statut: string
  vues: number
  images: string[]
  image_url: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [annonces, setAnnonces] = useState<Annonce[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ total: 0, disponibles: 0, louees: 0, vues: 0 })
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/login')
      return
    }
    setUser(session.user)
    fetchAnnonces(session.user.id)
  }

  async function fetchAnnonces(userId: string) {
    const { data, error } = await supabase
      .from('annonces')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    const list = data || []
    setAnnonces(list)
    setStats({
      total: list.length,
      disponibles: list.filter((a: Annonce) => a.statut !== 'louee').length,
      louees: list.filter((a: Annonce) => a.statut === 'louee').length,
      vues: list.reduce((sum: number, a: Annonce) => sum + (a.vues || 0), 0),
    })
    setLoading(false)
  }

  async function marquerLouee(id: string, currentStatut: string) {
    setActionLoading(id)
    const newStatut = currentStatut === 'louee' ? 'disponible' : 'louee'
    const { error } = await supabase
      .from('annonces')
      .update({ statut: newStatut })
      .eq('id', id)

    if (!error) {
      setAnnonces(prev =>
        prev.map(a => a.id === id ? { ...a, statut: newStatut } : a)
      )
      setStats(prev => ({
        ...prev,
        disponibles: newStatut === 'louee' ? prev.disponibles - 1 : prev.disponibles + 1,
        louees: newStatut === 'louee' ? prev.louees + 1 : prev.louees - 1,
      }))
    }
    setActionLoading(null)
  }

  async function supprimerAnnonce(id: string) {
    if (!confirm('Supprimer cette annonce définitivement ?')) return
    setActionLoading(id + '-del')
    const { error } = await supabase.from('annonces').delete().eq('id', id)
    if (!error) {
      setAnnonces(prev => prev.filter(a => a.id !== id))
      setStats(prev => ({ ...prev, total: prev.total - 1 }))
    }
    setActionLoading(null)
  }

  function getFirstImage(annonce: Annonce): string | null {
    if (annonce.images && annonce.images.length > 0) return annonce.images[0]
    if (annonce.image_url) return annonce.image_url
    return null
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-creme, #F5F0E8)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px', border: '3px solid #1A5C3A',
            borderTop: '3px solid transparent', borderRadius: '50%',
            animation: 'spin 1s linear infinite', margin: '0 auto 16px'
          }} />
          <p style={{ color: '#1A5C3A', fontWeight: 500 }}>Chargement...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-creme, #F5F0E8)', padding: '0 0 60px' }}>

      {/* Header dashboard */}
      <div style={{
        background: '#1A5C3A', color: '#fff',
        padding: '32px 20px 28px',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', opacity: 0.7, marginBottom: '4px', fontFamily: 'var(--font-dm, sans-serif)' }}>
            Tableau de bord
          </p>
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-playfair, serif)' }}>
            Mes annonces
          </h1>
          <p style={{ fontSize: '13px', opacity: 0.7, marginTop: '4px' }}>
            {user?.email}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px' }}>

        {/* Stats cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px',
          margin: '20px 0'
        }}>
          {[
            { label: 'Total annonces', value: stats.total, color: '#1A5C3A' },
            { label: 'Disponibles', value: stats.disponibles, color: '#2E7D32' },
            { label: 'Louées', value: stats.louees, color: '#C4622D' },
            { label: 'Vues totales', value: stats.vues, color: '#5C3A1A' },
          ].map(s => (
            <div key={s.label} style={{
              background: '#fff', borderRadius: '12px', padding: '16px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
            }}>
              <p style={{ fontSize: '28px', fontWeight: 700, color: s.color, margin: '0 0 4px', fontFamily: 'var(--font-playfair, serif)' }}>
                {s.value}
              </p>
              <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Bouton publier */}
        <Link href="/publier" style={{
          display: 'block', background: '#C4622D', color: '#fff',
          textAlign: 'center', padding: '14px', borderRadius: '12px',
          textDecoration: 'none', fontWeight: 600, fontSize: '15px',
          marginBottom: '24px'
        }}>
          + Publier une nouvelle annonce
        </Link>

        {/* Liste annonces */}
        {annonces.length === 0 ? (
          <div style={{
            background: '#fff', borderRadius: '16px', padding: '48px 24px',
            textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
          }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>🏠</p>
            <p style={{ fontWeight: 600, color: '#333', marginBottom: '8px' }}>Aucune annonce pour l'instant</p>
            <p style={{ color: '#888', fontSize: '14px' }}>Publiez votre première annonce et trouvez des locataires rapidement.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {annonces.map(annonce => {
              const img = getFirstImage(annonce)
              const estLouee = annonce.statut === 'louee'
              return (
                <div key={annonce.id} style={{
                  background: '#fff', borderRadius: '16px', overflow: 'hidden',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                  border: estLouee ? '2px solid #C4622D' : '2px solid transparent',
                  opacity: estLouee ? 0.85 : 1
                }}>
                  <div style={{ display: 'flex', gap: '0' }}>
                    {/* Image */}
                    <div style={{
                      width: '100px', minWidth: '100px', height: '100px',
                      background: '#eee', position: 'relative', flexShrink: 0
                    }}>
                      {img ? (
                        <img src={img} alt={annonce.titre}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', fontSize: '28px'
                        }}>🏠</div>
                      )}
                      {estLouee && (
                        <div style={{
                          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                          background: 'rgba(196,98,45,0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <span style={{
                            background: '#C4622D', color: '#fff', fontSize: '10px',
                            fontWeight: 700, padding: '2px 8px', borderRadius: '20px'
                          }}>LOUÉE</span>
                        </div>
                      )}
                    </div>

                    {/* Infos */}
                    <div style={{ padding: '12px', flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: '14px', fontWeight: 600, color: '#1A1A1A',
                        margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>
                        {annonce.titre}
                      </p>
                      <p style={{ fontSize: '16px', fontWeight: 700, color: '#1A5C3A', margin: '0 0 4px' }}>
                        {annonce.Prix?.toLocaleString('fr-FR')} <span style={{ fontSize: '11px', fontWeight: 400 }}>FCFA/mois</span>
                      </p>
                      <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px' }}>
                        {annonce.Quartier} · {annonce.type_logement}
                      </p>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#aaa' }}>
                        <span>👁 {annonce.vues || 0} vues</span>
                        <span>📅 {formatDate(annonce.created_at)}</span>
                        <span>🖼 {(annonce.images?.length || (annonce.image_url ? 1 : 0))} photo(s)</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex', gap: '8px', padding: '10px 12px',
                    borderTop: '1px solid #f0f0f0', background: '#fafafa'
                  }}>
                    <Link href={`/annonces/${annonce.id}`} style={{
                      flex: 1, textAlign: 'center', padding: '8px',
                      fontSize: '12px', fontWeight: 500, color: '#1A5C3A',
                      border: '1px solid #1A5C3A', borderRadius: '8px',
                      textDecoration: 'none'
                    }}>
                      Voir
                    </Link>
                    <Link href={`/modifier/${annonce.id}`} style={{
                      flex: 1, textAlign: 'center', padding: '8px',
                      fontSize: '12px', fontWeight: 500, color: '#5C3A1A',
                      border: '1px solid #C4622D', borderRadius: '8px',
                      textDecoration: 'none'
                    }}>
                      Modifier
                    </Link>
                    <button
                      onClick={() => marquerLouee(annonce.id, annonce.statut)}
                      disabled={actionLoading === annonce.id}
                      style={{
                        flex: 2, padding: '8px', fontSize: '12px', fontWeight: 500,
                        background: estLouee ? '#E8F5E9' : '#FFF3E0',
                        color: estLouee ? '#2E7D32' : '#C4622D',
                        border: 'none', borderRadius: '8px', cursor: 'pointer'
                      }}>
                      {actionLoading === annonce.id ? '...' : estLouee ? '✓ Disponible' : 'Marquer louée'}
                    </button>
                    <button
                      onClick={() => supprimerAnnonce(annonce.id)}
                      disabled={actionLoading === annonce.id + '-del'}
                      style={{
                        padding: '8px 10px', fontSize: '16px',
                        background: '#FFF0F0', color: '#c00',
                        border: 'none', borderRadius: '8px', cursor: 'pointer'
                      }}>
                      {actionLoading === annonce.id + '-del' ? '...' : '🗑'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
