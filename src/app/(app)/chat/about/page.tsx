'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function AboutCaraPage() {
  const router = useRouter();

  return (
    <div className="h-screen-safe flex flex-col overflow-hidden" style={{ background: 'white' }}>
      {/* Header */}
      <header className="flex items-center px-4 h-14 flex-shrink-0 relative"
        style={{ borderBottom: '1px solid var(--color-border-lighter)' }}>
        <button onClick={() => router.back()}
          className="p-2 rounded-xl btn-ghost absolute left-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-base w-full text-center" style={{ color: 'var(--color-text)' }}>
          About Cura
        </h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-10">
        <div className="max-w-sm mx-auto text-center">

          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Cura AI" className="w-24 h-24 object-contain" />
          </div>

          {/* Name & Version */}
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>Cura AI</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>CuraAi Version 1.0.0</p>

          {/* Description */}
          <p className="text-sm leading-relaxed mb-6 text-left" style={{ color: 'var(--color-text-muted)' }}>
            Cura AI is an AI-powered emotional companion built to offer genuine digital friendship through thoughtful, empathetic conversation. Cura listens without judgment, responds with care, and adapts to you over time, creating a space where you can talk openly, reflect, and feel understood.
          </p>

          <p className="text-sm leading-relaxed text-left" style={{ color: 'var(--color-text-muted)' }}>
            Designed to support moments of loneliness, stress, or simple everyday conversation, Cura isn&apos;t here to replace human connection, but to complement it. Whether you need to vent, think out loud, or just have someone with you, Cura shows up consistently, patiently, and with empathy.
          </p>
        </div>
      </div>
    </div>
  );
}
