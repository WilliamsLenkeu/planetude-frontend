import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { lofiService } from '../services/lofi.service'
import { useMusic } from '../contexts/MusicContext'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/PageHeader'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Music, Play, Pause } from 'lucide-react'
import type { LoFiTrack } from '../types'

export default function LoFi() {
  const [category, setCategory] = useState<string | ''>('')
  const { playTrack, currentTrack, isPlaying, setPlaylist } = useMusic()

  const { data: tracks, isLoading } = useQuery({
    queryKey: ['lofi', category],
    queryFn: () => lofiService.getAll(category || undefined),
  })

  const { data: categories } = useQuery({
    queryKey: ['lofi-categories'],
    queryFn: () => lofiService.getCategories(),
  })

  const handlePlay = (track: LoFiTrack) => {
    if (tracks) setPlaylist(tracks)
    playTrack(track)
  }

  const isCurrentTrack = (t: LoFiTrack) =>
    currentTrack && (t._id === currentTrack._id || t.url === currentTrack.url)

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Lo-Fi"
        description="Musique d'ambiance pour étudier"
      />

      {categories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory('')}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: category === '' ? 'var(--color-primary)' : 'var(--color-bg-tertiary)',
              color: category === '' ? '#fff' : 'var(--color-text-muted)',
            }}
          >
            Toutes
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: category === cat ? 'var(--color-primary)' : 'var(--color-bg-tertiary)',
                color: category === cat ? '#fff' : 'var(--color-text-muted)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <Card>
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <Music size={20} />
          Pistes
        </h2>
        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner fullScreen={false} />
          </div>
        ) : tracks && tracks.length > 0 ? (
          <div className="space-y-2">
            {tracks.map((track) => {
              const isPlayingThis = isCurrentTrack(track) && isPlaying
              return (
                <div
                  key={track._id || track.url}
                  className="flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-[var(--color-bg-tertiary)]"
                >
                  <button
                    type="button"
                    onClick={() => handlePlay(track)}
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      backgroundColor: isPlayingThis ? 'var(--color-primary)' : 'var(--color-bg-tertiary)',
                      color: isPlayingThis ? '#fff' : 'var(--color-text-muted)',
                    }}
                  >
                    {isPlayingThis ? <Pause size={22} /> : <Play size={22} />}
                  </button>
                  {track.thumbnail && (
                    <img
                      src={track.thumbnail}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate" style={{ color: 'var(--color-text)' }}>
                      {track.title}
                    </p>
                    <p className="text-sm truncate" style={{ color: 'var(--color-text-muted)' }}>
                      {track.artist}
                    </p>
                  </div>
                  {track.category && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: 'var(--color-bg-tertiary)',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {track.category}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
            <p className="text-sm">Aucune piste disponible</p>
            <p className="text-xs mt-2">Les pistes peuvent être ajoutées via le seed admin.</p>
          </div>
        )}
      </Card>
    </div>
  )
}
