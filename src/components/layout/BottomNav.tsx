'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, MessageCircle, Globe, BookOpen, User } from 'lucide-react';

const TABS = [
  { href: '/chat',          icon: Bot,           label: 'Home'    },
  { href: '/chats',         icon: MessageCircle, label: 'Chats'   },
  { href: '/global-solace', icon: Globe,         label: 'Solace'  },
  { href: '/stories',       icon: BookOpen,      label: 'Stories' },
  { href: '/profile',       icon: User,          label: 'Profile' },
];

const BLUE = '#2E2BFF';
const GRAY = '#AAAAAA';

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center"
      style={{
        background: 'white',
        borderTop: '1px solid #EFEFEF',
        height: '64px',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
      {TABS.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 h-full transition-colors"
            style={{ color: active ? BLUE : GRAY, textDecoration: 'none' }}>
            <div className="relative">
              {active && (
                <span
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full"
                  style={{ background: BLUE }}
                />
              )}
              <Icon
                className="w-6 h-6"
                strokeWidth={active ? 2.2 : 1.8}
                style={{ color: active ? BLUE : GRAY }}
              />
            </div>
            <span
              className="text-xs font-medium"
              style={{ color: active ? BLUE : GRAY, fontSize: '10px' }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
