import { useState, useEffect } from 'react'
import { Music, Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { lofiService } from '../services/lofi.service'
import { useMusic } from '../contexts/MusicContext'
import type { LoFiTrack } from '../types'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

export default function LoFi() {
  const { currentTrack, isPlaying, playTrack, togglePlay, volume, setVolume } = useMusic()
  const [tracks, setTracks] = useState<LoFiTrack[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await lofiService.getAll()
        const tracksData = Array.isArray(response) ? response : (response as any).data || []
        setTracks(tracksData)
        // Ne pas lancer automatiquement pour ne pas écraser une lecture en cours si on revient sur la page
      } catch (error) {
        console.error('Erreur LoFi:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTracks()
  }, [])

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-hello-black flex items-center justify-center gap-3">
          LoFi Chill Station <Music className="text-pink-candy" />
        </h2>
        <p className="text-hello-black/60 italic">"Musique douce pour étudier en paix... 🌸"</p>
      </div>

      <div className="kawaii-card bg-pink-milk/20 border-2 border-pink-milk p-8 text-center space-y-6">
        <div className="w-48 h-48 bg-white rounded-kawaii-lg mx-auto shadow-kawaii flex items-center justify-center overflow-hidden border-4 border-pink-candy/20">
          {currentTrack?.thumbnail ? (
            <img src={currentTrack.thumbnail} alt={currentTrack.title} className="w-full h-full object-cover" />
          ) : (
            <Music size={64} className="text-pink-candy opacity-20" />
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold text-hello-black">{currentTrack?.title || "Sélectionne une piste"}</h3>
          <p className="text-pink-candy font-medium uppercase tracking-widest text-xs mt-1">{currentTrack?.category || "Lofi"}</p>
        </div>

        <div className="flex items-center justify-center gap-8">
          <button className="p-3 text-hello-black/40 hover:text-pink-candy transition-colors">
            <SkipBack size={24} />
          </button>
          <button 
            onClick={togglePlay}
            disabled={!currentTrack}
            className={`w-16 h-16 bg-pink-candy rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform ${!currentTrack ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>
          <button className="p-3 text-hello-black/40 hover:text-pink-candy transition-colors">
            <SkipForward size={24} />
          </button>
        </div>

        <div className="flex items-center gap-4 max-w-xs mx-auto text-hello-black/40">
          <Volume2 size={20} />
          <div className="flex-1 h-2 bg-pink-milk rounded-full overflow-hidden relative">
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="h-full bg-pink-candy transition-all duration-150" 
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <h3 className="text-lg font-bold text-hello-black">Ta Playlist Girly 🎀</h3>
        {tracks.map((track) => (
          <button
            key={track._id}
            onClick={() => playTrack(track)}
            className={`flex items-center gap-4 p-4 rounded-kawaii border-2 transition-all ${
              currentTrack?._id === track._id 
                ? 'bg-pink-milk border-pink-candy' 
                : 'bg-white border-pink-milk/30 hover:border-pink-candy/50'
            }`}
          >
            <div className="w-12 h-12 bg-pink-milk rounded-lg flex items-center justify-center">
              <Music size={20} className="text-pink-candy" />
            </div>
            <div className="text-left flex-1">
              <p className="font-bold text-hello-black">{track.title}</p>
              <p className="text-xs text-hello-black/40">{track.category}</p>
            </div>
            {currentTrack?._id === track._id && isPlaying && (
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ height: [8, 16, 8] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                    className="w-1 bg-pink-candy rounded-full"
                  />
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
