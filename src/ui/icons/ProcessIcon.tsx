import type { ProcessId } from '../../engine/types'

export function ProcessIcon({ id }: { id: ProcessId }) {
  const accent = id === 'resilienceCenter' ? '#2f9f8f' : id === 'school' ? '#7c5cc4' : '#4d8fd6'
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true" className="icon icon-process">
      <rect x="7" y="9" width="22" height="18" rx="5" fill="#ffffff" stroke={accent} strokeWidth="2" />
      <circle cx="18" cy="18" r="4" fill={accent} opacity="0.18" />
      <path d="M18 5v6M18 25v6M4 18h7M25 18h7" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      {id === 'townCenter' && <path d="M13 22h10" stroke={accent} strokeWidth="2" strokeLinecap="round" />}
      {id === 'forest' && <path d="M14 21l4-8 4 8" stroke={accent} strokeWidth="2" strokeLinecap="round" fill="none" />}
      {id === 'farm' && <path d="M12 22c4-7 8-7 12 0" stroke={accent} strokeWidth="2" strokeLinecap="round" fill="none" />}
      {id === 'warehouse' && <path d="M12 15h12M12 21h12" stroke={accent} strokeWidth="2" strokeLinecap="round" />}
    </svg>
  )
}
