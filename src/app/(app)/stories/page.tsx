'use client';

import { useState } from 'react';
import { Plus, Camera, Type, Lock, ChevronRight, Play } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface Story {
  id: string;
  author: string;
  initials: string;
  time: string;
  viewed: boolean;
  count: number;
  color: string;
}

const DEMO_STORIES: Story[] = [
  { id: '1', author: 'Ngozi', initials: 'N', time: '2h ago', viewed: false, count: 3, color: '#FF2BA6' },
  { id: '2', author: 'Chidi', initials: 'C', time: '4h ago', viewed: false, count: 1, color: '#2E2BFF' },
  { id: '3', author: 'Alasela', initials: 'A', time: '6h ago', viewed: true, count: 2, color: '#8B5CF6' },
  { id: '4', author: 'Tunde', initials: 'T', time: '12h ago', viewed: true, count: 1, color: '#F59E0B' },
];

export default function StoriesPage() {
  const { user, profile } = useAuthStore();
  const [showCompose, setShowCompose] = useState(false);

  const initials = (profile?.display_name || user?.email || 'U')[0].toUpperCase();
  const isPremium = profile?.plan !== 'free';

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 64px)', background: '#F7F7F7' }}>

      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between"
        style={{ background: 'white', borderBottom: '1px solid #EFEFEF' }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>Stories</h1>
          <p className="text-xs mt-0.5" style={{ color: '#AAAAAA' }}>24-hour updates from friends</p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: '#2E2BFF' }}>
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* My Story */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#AAAAAA', fontFamily: 'Poppins, sans-serif' }}>
          Your Story
        </p>
        <div
          onClick={() => isPremium ? setShowCompose(true) : null}
          className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer"
          style={{ background: 'white', border: '1.5px solid #EFEFEF' }}>
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl"
              style={{ background: 'linear-gradient(135deg, #2E2BFF, #FF2BA6)' }}>
              {initials}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"
              style={{ background: '#2E2BFF' }}>
              <Plus className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>
              Add to your story
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#AAAAAA', fontFamily: 'Poppins, sans-serif' }}>
              {isPremium ? 'Share a photo, video, or thought' : 'Basic plan required · ₦2,000/month'}
            </p>
          </div>
          {!isPremium ? (
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
              style={{ background: '#FFF0F8', color: '#FF2BA6', whiteSpace: 'nowrap' }}>
              Upgrade
            </span>
          ) : (
            <ChevronRight className="w-4 h-4" style={{ color: '#AAAAAA' }} />
          )}
        </div>
      </div>

      {/* Friends Stories */}
      <div className="px-4 pt-2 pb-4">
        <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#AAAAAA', fontFamily: 'Poppins, sans-serif' }}>
          Recent
        </p>

        {DEMO_STORIES.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ background: '#F0F0FF' }}>
              <Camera className="w-9 h-9" style={{ color: '#2E2BFF' }} />
            </div>
            <h3 className="text-base font-bold mb-2" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>
              No stories yet
            </h3>
            <p className="text-sm" style={{ color: '#AAAAAA', fontFamily: 'Poppins, sans-serif' }}>
              When friends post stories, they&apos;ll appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {DEMO_STORIES.map(story => (
              <div
                key={story.id}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer"
                style={{ background: 'white', border: '1.5px solid #EFEFEF' }}>
                <div className="relative flex-shrink-0">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl"
                    style={{
                      background: story.viewed ? '#DDDDDD' : `linear-gradient(135deg, ${story.color}, ${story.color}88)`,
                      padding: '2px',
                    }}>
                    <div className="w-full h-full rounded-full flex items-center justify-center"
                      style={{ background: story.viewed ? '#EEEEEE' : story.color }}>
                      <span className="font-bold text-lg" style={{ color: 'white' }}>{story.initials}</span>
                    </div>
                  </div>
                  {story.count > 1 && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"
                      style={{ background: '#2E2BFF' }}>
                      <span style={{ color: 'white', fontSize: 9, fontWeight: 700 }}>{story.count}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>
                    {story.author}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#AAAAAA', fontFamily: 'Poppins, sans-serif' }}>
                    {story.time} · {story.count} {story.count === 1 ? 'update' : 'updates'}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: story.viewed ? '#F7F7F7' : '#EEF0FF' }}>
                  <Play className="w-4 h-4" style={{ color: story.viewed ? '#AAAAAA' : '#2E2BFF' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upgrade banner */}
      {!isPremium && (
        <div className="mx-4 mb-4 p-4 rounded-2xl"
          style={{ background: 'linear-gradient(135deg, #2E2BFF15, #FF2BA615)', border: '1.5px solid #2E2BFF25' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #2E2BFF, #FF2BA6)' }}>
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>
                Unlock Stories
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#888', fontFamily: 'Poppins, sans-serif' }}>
                Share moments with Basic plan · ₦2,000/mo
              </p>
            </div>
            <button className="px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ background: '#2E2BFF', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
              Upgrade
            </button>
          </div>
        </div>
      )}

      {/* Compose modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowCompose(false)}>
          <div className="w-full rounded-t-3xl p-6 pb-10" style={{ background: 'white' }}
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: '#EFEFEF' }} />
            <h3 className="text-lg font-bold mb-5" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>
              Create Story
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Camera, label: 'Photo / Video', desc: 'Share a moment', color: '#2E2BFF' },
                { icon: Type, label: 'Text Story', desc: 'Share a thought', color: '#FF2BA6' },
              ].map(({ icon: Icon, label, desc, color }) => (
                <button key={label}
                  className="flex flex-col items-center gap-2 p-5 rounded-2xl"
                  style={{ background: '#F7F7F7', border: '1.5px solid #EFEFEF', cursor: 'pointer' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: `${color}15` }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>{label}</p>
                  <p className="text-xs" style={{ color: '#AAAAAA', fontFamily: 'Poppins, sans-serif' }}>{desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
