import type { ResourceId } from '../../engine/types'

const resourceColors: Record<ResourceId, string> = {
  wood: '#8a633d',
  stone: '#748195',
  food: '#5f9f62',
  population: '#4979b7',
  knowledge: '#7c5cc4',
  resilience: '#2f9f8f',
  planks: '#b8793e',
  bricks: '#b35b50',
  metal: '#7b8797',
  bread: '#c89138',
  tools: '#4c8fb7',
  energy: '#d6a11f',
}

export function ResourceIcon({ id }: { id: ResourceId }) {
  const color = resourceColors[id]
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="icon icon-resource">
      <circle cx="16" cy="16" r="13" fill="white" stroke={color} strokeWidth="1.8" />
      <path d="M9 21h14M10 16h12M13 10l-3 11M19 10l3 11" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
