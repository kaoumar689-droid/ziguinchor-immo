'use client'

import { useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

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

type PhotoItem = {
  file: File
  preview: string
  uploading: boolean
  url?: string
  error?: string
}

export default function PublierPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    titre: '', prix: '', type_logement: '', quartier: '',
    telephone: '', description: '', surface: '', chambres: '1', meuble: false
  })
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

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
    const newPhotos: PhotoItem[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false
    }))
    setPhotos(prev => [...prev, ...newPhotos])
    // Reset input to allow re-selecting same file
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removePhoto(index: number) {
    setPhotos(prev => {
      URL.revokeObjectURL(prev[index].preview)
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

  async function uploadPhoto(photo: PhotoItem, index: number): Promise<string | null> {
    setPhotos(prev => prev.map((p, i) => i === index ? { ...p, uploading: true } : p))
    const ext = photo.file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(filename, photo.file, { cacheControl: '3600', upsert: false })

    if (error) {
      setPhotos(prev => prev.map((p, i) => i === index ? { ...p, uploading: false, error: 'Erreur upload' } : p))
      return null
    }

    const { data: urlData } = supabase.storage.from('property-images').getPublicUrl(data.path)
    const url = urlData.publicUrl
    setPhotos(prev => prev.map((p, i) => i === index ? { ...p, uploading: false, url } : p))
    return url
  }

  async function handleSubmit() {
    if (!form.titre || !form.prix || !form.type_logement || !form.Quartier || !form.telephone) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }
    setLoading(true)
    setError('')

    // Vérifier session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setError('Vous devez être connecté pour publier une annonce')
      setLoading(false)
      return
    }

    // Upload toutes les photos
    const imageUrls: string[] = []
    for (let i = 0; i < photos.length; i++) {
      if (photos[i].url) {
        imageUrls.push(photos[i].url!)
      } else {
        const url = await uploadPhoto(photos[i], i)
        if (url) imageUrls.push(url)
      }
    }

    // Insérer l'annonce
    const { error: insertError } = await supabase.from('annonces').insert({
      titre: form.titre,
      prix: parseInt(form.prix),
      type_logement: form.type_logement,
      quartier: form.quartier,
      telephone: form.telephone,
      description: form.description,
      surface: form.surface ? parseInt(form.surface) : null,
      chambres: parseInt(form.chambres),
      meuble: form.meuble,
      images: imageUrls,
      image_url: imageUrls[0] || null,
      user_id: session.user.id,
      statut: 'disponible',
      vues: 0,
    })

    if (insertError) {
      setError('Erreur lors de la publication : ' + insertError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#F5F0E8', flexDirection: 'column', gap: '16px', padding: '20px', textAlign: 'center'
      }}>
        <div style={{ fontSize: '56px' }}>✅</div>
        <h2 style={{ color: '#1A5C3A', fontWeight: 700, fontSize: '20px' }}>Annonce publiée !</h2>
        <p style={{ color: '#555' }}>Redirection vers votre tableau de bord...</p>
      </div>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#F5F0E8', paddingBottom: '60px' }}>

      {/* Header */}
      <div style={{ background: '#1A5C3A', padding: '28px 20px 24px', color: '#fff' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-playfair, serif)' }}>
            Publier une annonce
          </h1>
          <p style={{ fontSize: '13px', opacity: 0.7, marginTop: '4px' }}>
            Remplissez les informations de votre logement
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px 16px' }}>

        {/* Section Photos */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A', margin: '0 0 4px' }}>
            Photos du logement
          </h2>
          <p style={{ fontSize: '12px', color: '#888', margin: '0 0 16px' }}>
            {photos.length}/5 photos · La première photo sera la photo principale
          </p>

          {/* Grille photos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
            {photos.map((photo, i) => (
              <div key={i} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', aspectRatio: '1' }}>
                <img src={photo.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {i === 0 && (
                  <span style={{
                    position: 'absolute', top: '4px', left: '4px',
                    background: '#1A5C3A', color: '#fff', fontSize: '9px',
                    fontWeight: 700, padding: '2px 6px', borderRadius: '20px'
                  }}>PRINCIPALE</span>
                )}
                {photo.uploading && (
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '12px'
                  }}>Upload...</div>
                )}
                {photo.error && (
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(200,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '10px', padding: '4px', textAlign: 'center'
                  }}>{photo.error}</div>
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
            ))}

            {/* Bouton ajouter */}
            {photos.length < 5 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
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

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            style={{ display: 'none' }}
          />

          <p style={{ fontSize: '11px', color: '#aaa', margin: 0 }}>
            JPG, PNG · Max 5MB par photo · Flèche ◀ pour changer l'ordre
          </p>
        </div>

        {/* Infos principales */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A', margin: '0 0 16px' }}>
            Informations principales
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#333', display: 'block', marginBottom: '6px' }}>
                Titre de l'annonce *
              </label>
              <input name="titre" value={form.titre} onChange={handleChange}
                placeholder="Ex: Bel appartement F3 à Boucotte"
                style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Type de logement *</label>
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
                <input name="prix" type="number" value={form.prix} onChange={handleChange}
                  placeholder="Ex: 75000" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Téléphone WhatsApp *</label>
                <input name="telephone" value={form.telephone} onChange={handleChange}
                  placeholder="77XXXXXXX" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Surface (m²)</label>
                <input name="surface" type="number" value={form.surface} onChange={handleChange}
                  placeholder="Ex: 45" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nb. chambres</label>
                <select name="chambres" value={form.chambres} onChange={handleChange} style={inputStyle}>
                  {['1','2','3','4','5+'].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#F5F0E8', borderRadius: '10px' }}>
              <input type="checkbox" name="meuble" id="meuble"
                checked={form.meuble} onChange={handleChange}
                style={{ width: '18px', height: '18px', accentColor: '#1A5C3A' }} />
              <label htmlFor="meuble" style={{ fontSize: '14px', color: '#333', cursor: 'pointer' }}>
                Logement meublé
              </label>
            </div>

            <div>
              <label style={labelStyle}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                rows={4} placeholder="Décrivez votre logement : état, équipements, proximité services..."
                style={{ ...inputStyle, resize: 'vertical' as const }} />
            </div>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div style={{
            background: '#FFF0F0', border: '1px solid #ffcccc', borderRadius: '10px',
            padding: '12px 16px', marginBottom: '16px', color: '#c00', fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Bouton publier */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', background: loading ? '#888' : '#1A5C3A', color: '#fff',
            border: 'none', borderRadius: '14px', padding: '16px',
            fontSize: '16px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s'
          }}>
          {loading ? 'Publication en cours...' : 'Publier l\'annonce'}
        </button>
      </div>
    </main>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: '10px',
  border: '1.5px solid #e0e0e0', fontSize: '14px', background: '#fff',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-dm, sans-serif)'
}

const labelStyle: React.CSSProperties = {
  fontSize: '13px', fontWeight: 500, color: '#333',
  display: 'block', marginBottom: '6px'
}
