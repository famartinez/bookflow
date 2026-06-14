import { useLanguage } from '../contexts/LanguageContext'

export default function LanguageBanner() {
  const { lang, setLang, t } = useLanguage()

  if (lang !== null) {
    return (
      <div style={{
        background: 'var(--accent-soft)',
        borderBottom: '1px solid var(--line)',
        padding: '0.35rem 1.5rem',
        textAlign: 'right',
      }}>
        <button
          onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
          style={{
            fontSize: '0.75rem',
            padding: '0.2rem 0.7rem',
            borderColor: 'var(--line)',
            background: 'transparent',
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            border: '1px solid var(--line)',
            borderRadius: '2px',
            color: 'var(--ink-soft)',
          }}
        >
          🌐 {t.lang_toggle}
        </button>
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--accent-soft)',
      borderBottom: '1px solid var(--line)',
      padding: '0.8rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      flexWrap: 'wrap',
    }}>
      <span style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>
        ¿Te gustaría ver este sitio en Español? / Would you like this site in Spanish?
      </span>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          className="primary"
          onClick={() => setLang('es')}
          style={{ fontSize: '0.82rem', padding: '0.3rem 0.9rem' }}
        >
          Sí / Yes
        </button>
        <button
          className="ghost"
          onClick={() => setLang('en')}
          style={{ fontSize: '0.82rem', padding: '0.3rem 0.9rem' }}
        >
          No thanks / No gracias
        </button>
      </div>
    </div>
  )
}
