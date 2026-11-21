/** Orbit mark (assets/orbit-logo.svg) + wordmark. Drawn with currentColor; color comes from --brand-ink. */
export function OrbitMark({ size = 28 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="39 31 158 158" fill="none">
      <g transform="translate(30 20)" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="88" cy="90" r="66" strokeWidth="7" />
        <ellipse cx="88" cy="90" rx="49" ry="88" transform="rotate(-42 88 90)" strokeWidth="7" />
      </g>
      <path d="M118 78 C118 98 111 105 91 105 C111 105 118 112 118 132 C118 112 125 105 145 105 C125 105 118 98 118 78Z" fill="currentColor" />
    </svg>
  );
}

export function Logo() {
  return (
    <div
      aria-label="Orbit"
      role="img"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        height: 'var(--control-sm)',
        padding: '0 6px',
        color: 'var(--brand-ink)',
      }}
    >
      <OrbitMark />
      <span aria-hidden="true" style={{ fontSize: 20, lineHeight: 1, fontWeight: 400, letterSpacing: '-0.045em' }}>
        Orbit
      </span>
    </div>
  );
}
