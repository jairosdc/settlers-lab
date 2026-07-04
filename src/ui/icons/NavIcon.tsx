export type NavIconId = 'network' | 'process' | 'logistics' | 'research' | 'resilience' | 'data' | 'help' | 'build' | 'alert'

export function NavIcon({ id }: { id: NavIconId }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon icon-nav">
      {id === 'network' && <><path d="M6 12h12M8 7l8 10M16 7L8 17" /><circle cx="6" cy="12" r="2" /><circle cx="18" cy="12" r="2" /><circle cx="12" cy="5" r="2" /></>}
      {id === 'process' && <><rect x="5" y="6" width="14" height="12" rx="3" /><path d="M9 12h6" /></>}
      {id === 'logistics' && <><path d="M4 8h12l-3-3M20 16H8l3 3" /></>}
      {id === 'research' && <><path d="M8 5h8M9 5v6l-3 6h12l-3-6V5" /></>}
      {id === 'resilience' && <><path d="M12 4l7 4v5c0 4-3 6-7 7-4-1-7-3-7-7V8l7-4Z" /></>}
      {id === 'data' && <><path d="M5 19V9M12 19V5M19 19v-7" /></>}
      {id === 'help' && <><circle cx="12" cy="12" r="8" /><path d="M10 9a2 2 0 1 1 3 1.7c-.8.5-1 1-1 2M12 17h.01" /></>}
      {id === 'build' && <><path d="M5 19h14M8 16V8h8v8M10 8V5h4v3" /></>}
      {id === 'alert' && <><path d="M12 4l8 15H4l8-15Z" /><path d="M12 9v4M12 17h.01" /></>}
    </svg>
  )
}

export function Logo() {
  return (
    <svg viewBox="0 0 48 48" className="logo" aria-hidden="true">
      <path d="M11 31 24 9l13 22-13 8-13-8Z" fill="white" stroke="#4d8fd6" strokeWidth="3" />
      <circle cx="24" cy="9" r="4" fill="#4d8fd6" />
      <circle cx="11" cy="31" r="4" fill="#5fbf8f" />
      <circle cx="37" cy="31" r="4" fill="#8d74d6" />
    </svg>
  )
}
