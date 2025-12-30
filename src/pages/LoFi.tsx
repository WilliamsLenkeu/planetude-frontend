import { useState, useEffect } from 'react'
import { Music, Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { lofiService } from '../services/lofi.service'
import { useMusic } from '../contexts/MusicContext'
import type { LoFiTrack } from '../types'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

export default function LoFi() {
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    togglePlay, 
    volume, 
    setVolume, 
    currentTime, 
    duration, 
    seek,
    nextTrack,
    prevTrack,
    setPlaylist
  } = useMusic()
  const [tracks, setTracks] = useState<LoFiTrack[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await lofiService.getAll()
        const tracksData: LoFiTrack[] = Array.isArray(response) ? response : (response as any).data || []
        
        // Supprimer les doublons basés sur l'URL de la musique
        const uniqueTracks = tracksData.reduce((acc: LoFiTrack[], current) => {
          const x = acc.find(item => item.url === current.url);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);

        setTracks(uniqueTracks)
        setPlaylist(uniqueTracks)
      } catch (error) {
        console.error('Erreur LoFi:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTracks()
  }, [])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 pb-20">
      {/* Header / Player Section as a Large Notebook Page */}
      <div className="relative">
        {/* Binder Rings Simulation */}
        <div className="hidden md:flex absolute left-[-2rem] top-12 bottom-12 flex-col justify-around z-20">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-300 to-gray-100 border border-gray-400/30 shadow-sm shadow-inner" />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="notebook-page p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 min-h-[450px]"
        >
          {/* Polaroid-style Thumbnail */}
          <div className="relative z-10">
            <motion.div 
              animate={isPlaying ? { rotate: [0, 1, -1, 0] } : {}}
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
              className="w-64 h-72 bg-white p-4 shadow-xl border border-pink-milk/20 rotate-[-2deg] relative group"
            >
              <div className="w-full h-56 bg-gray-50 overflow-hidden mb-4 relative">
                {currentTrack?.thumbnail ? (
                  <img src={currentTrack.thumbnail} alt={currentTrack.title} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-pink-candy/20">
                    <Music size={64} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-40" />
              </div>
              <div className="text-center font-display text-pink-deep/60 italic text-sm">
                {currentTrack?.title || "Sélectionne une piste..."}
              </div>
              {/* Paper Clip Decorative */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-12 bg-gray-300/40 rounded-full border-2 border-gray-400/30 rotate-12 backdrop-blur-sm" />
            </motion.div>
          </div>

          <div className="flex-1 space-y-8 pl-0 md:pl-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-[1px] w-8 bg-pink-candy/40" />
                <span className="text-pink-deep/60 text-xs font-black uppercase tracking-[0.3em] font-sans">
                  {currentTrack?.category || "Studio LoFi"}
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-semibold text-hello-black leading-tight font-display mb-4">
                {currentTrack?.title || "Moment de Calme"}
              </h2>
              <p className="text-hello-black/40 italic text-xl font-serif">
                "Trouve ton rythme, écris ton histoire... 🌸"
              </p>
            </div>

            {/* Controls Container as a "Desk Tray" style */}
            <div className="space-y-6 max-w-xl">
              {/* Progress Bar - Minimalist Line */}
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black text-pink-deep/40 tracking-widest px-1 uppercase">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div className="h-1 bg-pink-milk/30 rounded-full relative group">
                  <motion.div 
                    className="h-full bg-pink-candy" 
                    style={{ width: `${progress}%` }}
                  />
                  <input 
                    type="range"
                    min="0"
                    max={duration || 0}
                    step="0.1"
                    value={currentTime}
                    onChange={(e) => seek(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={prevTrack}
                    disabled={!currentTrack}
                    className="text-hello-black/30 hover:text-pink-candy transition-colors disabled:opacity-20"
                  >
                    <SkipBack size={24} />
                  </button>
                  
                  <button 
                    onClick={togglePlay}
                    disabled={!currentTrack}
                    className="w-16 h-16 bg-pink-candy rounded-full flex items-center justify-center text-white shadow-lg shadow-pink-candy/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" className="ml-1" />}
                  </button>

                  <button 
                    onClick={nextTrack}
                    disabled={!currentTrack}
                    className="text-hello-black/30 hover:text-pink-candy transition-colors disabled:opacity-20"
                  >
                    <SkipForward size={24} />
                  </button>
                </div>

                <div className="hidden lg:flex items-center gap-4 flex-1 max-w-[200px]">
                  <Volume2 size={16} className="text-pink-deep/40" />
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 h-0.5 bg-pink-milk/30 appearance-none cursor-pointer accent-pink-candy"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Playlist Section as Loose Papers */}
      <div className="space-y-8">
        <div className="flex items-end justify-between px-4">
          <div>
            <h3 className="text-2xl font-semibold text-hello-black font-display">
              Bibliothèque de Studio
            </h3>
            <p className="text-pink-deep/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
              {tracks.length} Pistes pour s'évader
            </p>
          </div>
          <div className="h-[2px] flex-1 mx-8 mb-2 bg-gradient-to-r from-pink-candy/20 to-transparent hidden md:block" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tracks.map((track, index) => (
            <motion.button
              key={track._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ rotate: index % 2 === 0 ? -1 : 1, y: -5 }}
              onClick={() => playTrack(track)}
              className={`notebook-page p-6 flex items-center gap-6 text-left transition-all group border-l-4 ${
                currentTrack?._id === track._id 
                  ? 'border-pink-candy' 
                  : 'border-sage-soft/30 hover:border-pink-candy/40'
              }`}
            >
              <div className="relative w-16 h-16 flex-shrink-0">
                <div className="w-full h-full bg-white rounded-lg shadow-sm overflow-hidden border border-pink-milk/20">
                  {track.thumbnail ? (
                    <img src={track.thumbnail} alt="" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-pink-candy/20">
                      <Music size={20} />
                    </div>
                  )}
                </div>
                {currentTrack?._id === track._id && isPlaying && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-candy rounded-full flex items-center justify-center text-white border-2 border-white">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Music size={10} />
                    </motion.div>
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-hello-black truncate font-display">
                  {track.title}
                </p>
                <p className="text-[10px] font-black text-pink-deep/40 uppercase tracking-widest mt-1">
                  {track.category}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  ) 
}
