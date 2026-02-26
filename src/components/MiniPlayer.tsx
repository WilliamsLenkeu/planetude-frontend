import { useState } from 'react'
import { useMusic } from '../contexts/MusicContext'
import { Music, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, volume, setVolume } = useMusic()
  const [showVolume, setShowVolume] = useState(false)

  if (!currentTrack) {
    return (
      <div
        className="hidden md:flex fixed bottom-0 left-0 right-0 items-center gap-4 px-4 py-3 border-t z-30"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-card-bg) 98%, transparent)',
          backdropFilter: 'blur(12px)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
        >
          <Music size={22} style={{ color: 'var(--color-text-muted)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
            Pas de lecture
          </p>
          <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
            Lo-Fi en pause
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="hidden md:flex fixed bottom-0 left-0 right-0 items-center gap-4 px-4 py-3 border-t z-30"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-card-bg) 98%, transparent)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--color-border)',
      }}
    >
      {currentTrack.thumbnail ? (
        <img
          src={currentTrack.thumbnail}
          alt=""
          className="w-12 h-12 rounded-xl object-cover shrink-0"
        />
      ) : (
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
        >
          <Music size={22} style={{ color: 'var(--color-text-muted)' }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
          {currentTrack.title}
        </p>
        <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
          {currentTrack.artist}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={prevTrack}
          className="p-2 rounded-lg transition-colors hover:bg-[var(--color-bg-tertiary)]"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <SkipBack size={20} />
        </button>
        <button
          type="button"
          onClick={togglePlay}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
          }}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button
          type="button"
          onClick={nextTrack}
          className="p-2 rounded-lg transition-colors hover:bg-[var(--color-bg-tertiary)]"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <SkipForward size={20} />
        </button>
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowVolume((v) => !v)}
          className="p-2 rounded-lg transition-colors hover:bg-[var(--color-bg-tertiary)]"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <Volume2 size={20} />
        </button>
        {showVolume && (
          <div
            className="absolute bottom-full right-0 mb-2 p-2 rounded-lg surface shadow-lg"
            style={{ minWidth: 120 }}
          >
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${volume * 100}%, var(--color-border-light) ${volume * 100}%, var(--color-border-light) 100%)`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
