'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const QUARTIERS = [
  'Boucotte', 'Kandialang', 'Lyndiane', 'Santhiaba', 'Néma', 'Colobane',
  'Tilène', 'Diabir', 'Boudody', 'Djibelor', 'Kénia', 'Goumel',
  'Soucoupapaye', 'Escale', 'Boukot', 'Kansahoudy'
]
const TYPES = ['Appartement', 'Chambre', 'Studio', 'Villa', 'Maison', 'Bureau']

type ExistingPhoto = { url: string; isNew: false }
type NewPhoto = { file: File; preview: string; uploading: boolean; url?: string; isNew: true }
type Photo = ExistingPhoto | NewPhoto

export default function ModifierPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    titre: '', Prix: '', type_logement: '', Quartier: '',
    telephone: '', description: '', surface: '', chambres: '1', meuble: false
  })
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (id) fetchAnnonce()
  }, [id])

  async function fetchAnnonce() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/auth/login'); return }

    const { data, error } = await supabase
      .from('annonces')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (error || !data) { router.push('/dashboard'); return }

    setForm({
      titre: data.titre || '',
      Prix: data.Prix?.toString() || '',
      type_logement: data.type_logement || '',
      Quartier: data.Quartier || '',
      telephone: data.téléphone || '',
      description: data.description || '',
      surface: data.surface?.toString() || '',
      chambres: data.chambres?.toString() || '1',
      meuble: data.meuble || false,
    })

    // Charger les photos existantes
    const existingImages: string[] = data.images?.length > 0
      ? data.images
      : data.image_url ? [data.image_url] : []

    setPhotos(existingImages.map(url => ({ url, isNew: false } as ExistingPhoto)))
    setLoading(false)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const target = e.target as HTMLInputElement
    const value = target.type === 'checkbox' ? target.checked : target.value
    setForm(prev => ({ ...prev, [target.name]: value }))
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (photos.length + files.length > 5) {
      setError('Maximum 5 photos autorisées')
      return
    }
    setError('')
    const newPhotos: NewPhoto[] = files.map(file => ({
      file, preview: URL.createObjectURL(file), uploading: false, isNew: true
    }))
    setPhotos(prev => [...prev, ...newPhotos])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removePhoto(index: number) {
    setPhotos(prev => {
      const photo = prev[index]
      if (photo.isNew) URL.revokeObjectURL(photo.preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  function movePhoto(from: number, to: number) {
    setPhotos(prev => {
      const arr = [...prev]
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      return arr
    })
  }

  async function uploadNewPhoto(photo: NewPhoto, index: number): Promise<string | null> {
    setPhotos(prev => prev.map((p, i) => i === index && p.isNew ? { ...p, uploading: true } : p))
    const ext = photo.file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(filename, photo.file, { cacheControl: '3600', upsert: false })

    if (error) return null
    const { data: urlData } = supabase.storage.from('property-images').getPublicUrl(data.path)
    return urlData.publicUrl
  }

  async function handleSave() {
    if (!form.titre || !form.Prix || !form.type_logement || !form.Quartier || !form.telephone) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }
    setSaving(true)
    setError('')

    const imageUrls: string[] = []
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i]
      if (!photo.isNew) {
        imageUrls.push(photo.url)
      } else {
        const url = await uploadNewPhoto(photo, i)
        if (url) imageUrls.push(url)
      }
    }

    const { error: updateError } = await supabase
      .from('annonces')
      .update({
        titre: form.titre,
        Prix: parseInt(form.Prix),
        type_logement: form.type_logement,
        Quartier: form.Quartier,
        téléphone: form.telephone,
        description: form.description,
        surface: form.surface ? parseInt(form.surface) : null,
        chambres: parseInt(form.chambres),
        meuble: form.meuble,
        images: imageUrls,
        image_url: imageUrls[0] || null,
      })
      .eq('id', id)

    if (updateError) {
      setError('Erreur lors de la sauvegarde : ' + updateError.message)
      setSaving(false)
      return
    }

    setSuccess(true)
    setSaving(false)
    setTimeout(() => router.push('/dashboard'), 1500)
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#F5F0E8'
      }}>
        <p style={{ color: '#1A5C3A' }}>Chargement...</p>
      </div>
    )
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#F5F0E8', flexDirection: 'column', gap: '16px', textAlign: 'center'
      }}>
        <div style={{ fontSize: '56px' }}>✅</div>
        <h2 style={{ color: '#1A5C3A', fontWeight: 700 }}>Annonce mise à jour !</h2>
      </div>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#F5F0E8', paddingBottom: '60px' }}>

      <div style={{ background: '#1A5C3A', padding: '28px 20px 24px', color: '#fff' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard" style={{ color: '#fff', textDecoration: 'none', fontSize: '20px' }}>←</Link>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-playfair, serif)' }}>
              Modifier l'annonce
            </h1>
            <p style={{ fontSize: '13px', opacity: 0.7, marginTop: '2px' }}>
              Les modifications seront visibles immédiatement
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px 16px' }}>

        {/* Photos */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 4px' }}>Photos</h2>
          <p style={{ fontSize: '12px', color: '#888', margin: '0 0 16px' }}>
            {photos.length}/5 · La première photo sera la photo principale
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
            {photos.map((photo, i) => {
              const src = photo.isNew ? photo.preview : photo.url
              return (
                <div key={i} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', aspectRatio: '1' }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {i === 0 && (
                    <span style={{
                      position: 'absolute', top: '4px', left: '4px',
                      background: '#1A5C3A', color: '#fff', fontSize: '9px',
                      fontWeight: 700, padding: '2px 6px', borderRadius: '20px'
                    }}>PRINCIPALE</span>
                  )}
                  <div style={{ position: 'absolute', top: '4px', right: '4px', display: 'flex', gap: '4px' }}>
                    {i > 0 && (
                      <button onClick={() => movePhoto(i, i - 1)} style={{
                        background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                        width: '22px', height: '22px', cursor: 'pointer', fontSize: '10px'
                      }}>◀</button>
                    )}
                    <button onClick={() => removePhoto(i)} style={{
                      background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                      width: '22px', height: '22px', cursor: 'pointer', fontSize: '12px', color: '#c00'
                    }}>✕</button>
                  </div>
                </div>
              )
            })}
            {photos.length < 5 && (
              <button onClick={() => fileInputRef.current?.click()} style={{
                aspectRatio: '1', borderRadius: '10px', border: '2px dashed #C4622D',
                background: '#FFF8F5', cursor: 'pointer', display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '4px', color: '#C4622D'
              }}>
                <span style={{ fontSize: '24px' }}>+</span>
                <span style={{ fontSize: '11px', fontWeight: 500 }}>Ajouter</span>
              </button>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple
            onChange={handleFiles} style={{ display: 'none' }} />
        </div>

        {/* Formulaire */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 16px' }}>Informations</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            <div>
              <label style={labelStyle}>Titre *</label>
              <input name="titre" value={form.titre} onChange={handleChange} style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Type *</label>
                <select name="type_logement" value={form.type_logement} onChange={handleChange} style={inputStyle}>
                  <option value="">Choisir...</option>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Quartier *</label>
                <select name="Quartier" value={form.Quartier} onChange={handleChange} style={inputStyle}>
                  <option value="">Choisir...</option>
                  {QUARTIERS.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Prix (FCFA/mois) *</label>
                <input name="Prix" type="number" value={form.Prix} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Téléphone *</label>
                <input name="telephone" value={form.telephone} onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Surface (m²)</label>
                <input name="surface" type="number" value={form.surface} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Chambres</label>
                <select name="chambres" value={form.chambres} onChange={handleChange} style={inputStyle}>
                  {['1','2','3','4','5+'].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#F5F0E8', borderRadius: '10px' }}>
              <input type="checkbox" name="meuble" id="meuble2"
                checked={form.meuble} onChange={handleChange}
                style={{ width: '18px', height: '18px', accentColor: '#1A5C3A' }} />
              <label htmlFor="meuble2" style={{ fontSize: '14px', color: '#333', cursor: 'pointer' }}>
                Logement meublé
              </label>
            </div>

            <div>
              <label style={labelStyle}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                rows={4} style={{ ...inputStyle, resize: 'vertical' as const }} />
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            background: '#FFF0F0', border: '1px solid #ffcccc', borderRadius: '10px',
            padding: '12px 16px', marginBottom: '16px', color: '#c00', fontSize: '14px'
          }}>{error}</div>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/dashboard" style={{
            flex: 1, textAlign: 'center', padding: '14px',
            border: '1.5px solid #1A5C3A', color: '#1A5C3A', borderRadius: '12px',
            textDecoration: 'none', fontWeight: 600, fontSize: '15px'
          }}>
            Annuler
          </Link>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 2, background: saving ? '#888' : '#1A5C3A', color: '#fff',
            border: 'none', borderRadius: '12px', padding: '14px',
            fontSize: '15px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer'
          }}>
            {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </div>
    </main>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: '10px',
  border: '1.5px solid #e0e0e0', fontSize: '14px', background: '#fff',
  outline: 'none', boxSizing: 'border-box'
}

const labelStyle: React.CSSProperties = {
  fontSize: '13px', fontWeight: 500, color: '#333',
  display: 'block', marginBottom: '6px'
}
