import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Music, X, Volume2 } from 'lucide-react';
import { useMusic } from '../contexts/MusicContext';
import { Link } from 'react-router-dom';

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, stop, volume, setVolume } = useMusic();

  if (!currentTrack) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="hidden md:flex fixed bottom-6 right-6 z-50 items-center gap-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-kawaii border-2 border-pink-candy/30 min-w-[300px]"
      >
        {/* Thumbnail/Icon */}
        <Link to="/lofi" className="relative group">
          <div className="w-12 h-12 bg-pink-milk rounded-xl flex items-center justify-center overflow-hidden border-2 border-pink-candy/20">
            {currentTrack.thumbnail ? (
              <img src={currentTrack.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            ) : (
              <Music className="text-pink-candy" size={20} />
            )}
          </div>
          <div className="absolute inset-0 bg-pink-candy/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
            <Music size={16} className="text-white" />
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-hello-black truncate leading-tight">
            {currentTrack.title}
          </p>
          <p className="text-[10px] font-medium text-pink-candy uppercase tracking-wider">
            {currentTrack.category}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Volume Slider Simple */}
          <div className="group relative flex items-center">
            <Volume2 size={16} className="text-hello-black/40 group-hover:text-pink-candy transition-colors" />
            <div className="absolute bottom-full right-0 mb-2 p-2 bg-white rounded-lg shadow-kawaii border border-pink-milk opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 h-1 bg-pink-milk rounded-full appearance-none cursor-pointer accent-pink-candy"
              />
            </div>
          </div>

          <button 
            onClick={togglePlay}
            className="w-10 h-10 bg-pink-candy text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
          </button>

          <button 
            onClick={stop}
            className="p-1.5 text-hello-black/20 hover:text-kitty-red transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Animation Bars (Visible quand joue) */}
        {isPlaying && (
          <div className="absolute -top-1 -right-1 flex gap-0.5 items-end h-4">
            {[1, 2, 3].map(i => (
              <motion.div
                key={i}
                animate={{ height: [4, 12, 4] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                className="w-1 bg-pink-candy rounded-full"
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
