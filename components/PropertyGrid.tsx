'use client'
import PropertyCard, { Property } from '@/components/PropertyCard'

export default function PropertyGrid({ properties }: { properties: Property[] }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
        </div>
    )
}