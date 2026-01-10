import { useMemo } from 'react'
import { Music, Play, Pause, Sparkles, Volume2, SkipForward, SkipBack } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { lofiService } from '../services/lofi.service'
import { useMusic } from '../contexts/MusicContext'
import type { LoFiTrack } from '../types'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { useQuery } from '@tanstack/react-query'

export default function LoFi() {
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    togglePlay, 
    setPlaylist,
    nextTrack,
    prevTrack
  } = useMusic()

  const { data: rawTracks = [], isLoading } = useQuery({
    queryKey: ['lofi-tracks'],
    queryFn: async () => {
      const response = await lofiService.getAll()
      const tracksData: LoFiTrack[] = Array.isArray(response) ? response : (response as any).data || []
      
      const uniqueTracks = tracksData.reduce((acc: LoFiTrack[], current) => {
        const trackUrl = current.url || current.audioUrl;
        if (!trackUrl) return acc;
        
        const x = acc.find(item => item.url === trackUrl || item.audioUrl === trackUrl);
        if (!x) {
          return acc.concat([{
            ...current,
            url: trackUrl
          }]);
        } else {
          return acc;
        }
      }, []);

      setPlaylist(uniqueTracks)
      return uniqueTracks
    }
  })

  const tracks = useMemo(() => rawTracks, [rawTracks])

  if (isLoading) return <LoadingSpinner fullScreen />

  return (
    <div className="min-h-screen relative overflow-hidden pb-32">
      {/* Background Decor - Design 2.0 */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 360] 
          }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-pink-milk/40 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 0] 
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-blue-cloud/30 rounded-full blur-[120px]" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 space-y-20 relative z-10">
        {/* Header Immersif */}
        <header className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="space-y-8 flex-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-[1.5rem] bg-white shadow-xl flex items-center justify-center border border-white">
                <Music size={28} className="text-pink-deep" strokeWidth={1.5} />
              </div>
              <div className="h-[1px] w-12 bg-hello-black/10" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-hello-black/30">Atmosphère & Focus</span>
            </motion.div>
            
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black text-hello-black tracking-tight leading-[0.85]">
                Focus <br />
                <span className="text-pink-deep italic font-serif font-normal">Lofi Studio.</span>
              </h1>
              <p className="text-xl text-hello-black/40 font-medium italic max-w-md">
                Crée ta propre bulle de sérénité pour une concentration absolue. ✨
              </p>
            </div>
          </div>

          {/* Player Central - Design 2.0 Glassmorphism */}
          <div className="w-full max-w-xl">
            <motion.div 
              layout
              className="relative p-10 bg-white/40 backdrop-blur-3xl rounded-[4rem] border border-white shadow-2xl shadow-black/[0.02] overflow-hidden group"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-milk/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                {/* Vinyl/Cover Animation */}
                <div className="relative">
                  <motion.div 
                    animate={isPlaying ? { rotate: 360 } : {}}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="w-48 h-48 rounded-full p-2 bg-white shadow-2xl border-4 border-white relative overflow-hidden"
                  >
                    <img 
                      src={currentTrack?.thumbnail || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=400&h=400&auto=format&fit=crop'} 
                      alt="Cover"
                      className="w-full h-full object-cover rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white rounded-full shadow-inner border-2 border-pink-milk flex items-center justify-center">
                        <div className="w-2 h-2 bg-pink-deep rounded-full" />
                      </div>
                    </div>
                  </motion.div>
                  
                  {isPlaying && (
                    <div className="absolute -inset-4 border-2 border-pink-deep/10 rounded-full animate-ping pointer-events-none" />
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-hello-black tracking-tight truncate max-w-xs">
                    {currentTrack?.title || 'En attente...'}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles size={14} className="text-pink-deep" />
                    <p className="text-xs text-pink-deep font-bold uppercase tracking-[0.2em]">
                      {currentTrack?.category || 'Sélectionne une piste'}
                    </p>
                  </div>
                </div>

                {/* Visualizer Simple */}
                <div className="flex items-end justify-center gap-1.5 h-12">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={isPlaying ? { height: [8, Math.random() * 40 + 10, 8] } : { height: 8 }}
                      transition={{ repeat: Infinity, duration: 0.5 + Math.random(), delay: i * 0.05 }}
                      className="w-1.5 bg-pink-deep/20 rounded-full"
                    />
                  ))}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-10">
                  <button 
                    onClick={prevTrack}
                    className="text-pink-deep/40 hover:text-pink-deep transition-colors"
                  >
                    <SkipBack size={24} fill="currentColor" />
                  </button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    disabled={!currentTrack}
                    className="w-20 h-20 rounded-full bg-hello-black text-white flex items-center justify-center hover:bg-pink-deep transition-all shadow-2xl shadow-black/10 disabled:opacity-30 group/play"
                  >
                    {isPlaying ? (
                      <Pause size={28} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                    ) : (
                      <Play size={28} fill="currentColor" className="ml-1 group-hover:scale-110 transition-transform" />
                    )}
                  </motion.button>

                  <button 
                    onClick={nextTrack}
                    className="text-pink-deep/40 hover:text-pink-deep transition-colors"
                  >
                    <SkipForward size={24} fill="currentColor" />
                  </button>
                </div>

                <div className="w-full flex items-center gap-4 text-hello-black/20">
                  <Volume2 size={16} />
                  <div className="flex-1 h-1.5 bg-pink-milk/50 rounded-full overflow-hidden border border-white">
                    <motion.div 
                      className="h-full bg-pink-deep"
                      style={{ width: '65%' }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Bibliothèque de Sons */}
        <div className="space-y-12">
          <div className="flex items-center justify-between border-b border-hello-black/5 pb-8">
            <div className="flex items-center gap-6">
              <h2 className="text-3xl font-black text-hello-black tracking-tight uppercase">Bibliothèque</h2>
              <div className="px-5 py-2 bg-white border border-pink-milk rounded-full shadow-sm">
                <span className="text-[10px] font-black text-pink-deep uppercase tracking-[0.2em]">{tracks.length} Pistes disponibles</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tracks.map((track, index) => (
              <motion.button
                key={track._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => playTrack(track)}
                className={`group relative flex items-center gap-6 p-6 rounded-[3rem] border transition-all text-left overflow-hidden ${
                  currentTrack?._id === track._id 
                    ? 'bg-white border-pink-candy shadow-2xl shadow-pink-candy/10' 
                    : 'bg-white/40 border-white hover:bg-white hover:border-pink-milk'
                }`}
              >
                <div className="relative w-24 h-24 rounded-3xl overflow-hidden shadow-lg border-2 border-white">
                  <img src={track.thumbnail} alt={track.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  
                  <AnimatePresence>
                    {currentTrack?._id === track._id && isPlaying && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-pink-deep/40 flex items-center justify-center backdrop-blur-[2px]"
                      >
                        <div className="flex gap-1 h-8 items-end">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              animate={{ height: [4, 24, 8, 32, 4] }}
                              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                              className="w-1.5 bg-white rounded-full"
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <h4 className={`text-xl font-black truncate tracking-tight ${currentTrack?._id === track._id ? 'text-hello-black' : 'text-hello-black/60 group-hover:text-hello-black'}`}>
                    {track.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${currentTrack?._id === track._id ? 'bg-pink-deep animate-pulse' : 'bg-hello-black/10'}`} />
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-hello-black/30">
                      {track.category}
                    </p>
                  </div>
                </div>

                {currentTrack?._id === track._id && (
                  <div className="absolute top-6 right-8">
                    <div className="w-3 h-3 bg-pink-deep rounded-full animate-ping" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
