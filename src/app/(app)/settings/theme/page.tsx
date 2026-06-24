'use client';

  import { useState, useEffect } from 'react';
  import { useRouter } from 'next/navigation';
  import { ChevronLeft } from 'lucide-react';

  type Theme = 'system' | 'light' | 'dark';

  export default function ThemePage() {
    const router = useRouter();
    const [theme, setTheme] = useState<Theme>('system');

    useEffect(() => {
      const saved = localStorage.getItem('cura-theme') as Theme | null;
      if (saved) setTheme(saved);
    }, []);

    const applyTheme = (t: Theme) => {
      setTheme(t);
      localStorage.setItem('cura-theme', t);
      const root = document.documentElement;
      if (t === 'dark') root.setAttribute('data-theme', 'dark');
      else if (t === 'light') root.setAttribute('data-theme', 'light');
      else root.removeAttribute('data-theme');
    };

    const options: { value: Theme; label: string; sub?: string }[] = [
      { value: 'system', label: 'System Default', sub: 'This will use your device settings' },
      { value: 'light', label: 'Light Mode' },
      { value: 'dark', label: 'Dark Mode' },
    ];

    return (
      <div style={{ minHeight: '100dvh', background: 'var(--page-bg)', fontFamily: 'inherit' }}>

        <div style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(12px, 3vw, 20px) 20px', position: 'relative', minHeight: 56 }}>
            <button onClick={() => router.back()}
              style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#2E2BFF', fontFamily: 'inherit', padding: 4 }}>
              <ChevronLeft size={22} />
            </button>
            <span style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>Theme</span>
          </div>
        </div>

        <div style={{ maxWidth: 560, margin: '0 auto', padding: 'clamp(16px, 4vw, 24px) clamp(12px, 3vw, 20px)' }}>
          <div style={{ background: 'var(--card-bg)', borderRadius: 12, overflow: 'hidden' }}>
            {options.map((opt, i) => (
              <button
                key={opt.value}
                onClick={() => applyTheme(opt.value)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '16px', background: 'none', border: 'none', borderBottom: i < options.length - 1 ? '1px solid var(--border-light)' : 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                <div>
                  <p style={{ fontSize: 15, color: 'var(--text-primary)', margin: 0, fontWeight: theme === opt.value ? 500 : 400 }}>{opt.label}</p>
                  {opt.sub && <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>{opt.sub}</p>}
                </div>
                {theme === opt.value && (
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#2E2BFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
  