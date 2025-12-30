import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Music, X, Volume2, Maximize2 } from 'lucide-react';
import { useMusic } from '../contexts/MusicContext';
import { Link } from 'react-router-dom';

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, stop, volume, setVolume, currentTime, duration, seek } = useMusic();

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.9 }}
        whileHover={{ y: -5 }}
        className="fixed bottom-6 right-6 z-50 flex flex-col bg-white p-5 shadow-notebook border-l-4 border-pink-candy min-w-[340px] group"
      >
        {/* Paper Tape Decorative */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-pink-candy/10 border border-pink-candy/5 backdrop-blur-[2px] z-10 rotate-[-1deg]" />

        {/* Progress Bar - Subtle Notebook Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-pink-milk/50 overflow-hidden">
          <motion.div 
            className="h-full bg-pink-candy"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.2 }}
          />
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
          />
        </div>

        <div className="flex items-center gap-5 mt-2">
          {/* Thumbnail - Polaroid Style */}
          <Link to="/lofi" className="relative group/thumb shrink-0">
            <motion.div 
              animate={isPlaying ? { rotate: [0, 2, -2, 0] } : {}}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="w-16 h-16 bg-white p-1.5 shadow-sm border border-pink-milk/30 rotate-[-2deg]"
            >
              <div className="w-full h-full bg-pink-milk/20 overflow-hidden relative">
                {currentTrack.thumbnail ? (
                  <img src={currentTrack.thumbnail} alt="" className="w-full h-full object-cover grayscale-[20%]" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-pink-candy/20">
                    <Music size={20} />
                  </div>
                )}
              </div>
            </motion.div>
          </Link>

          {/* Info */}
          <div className="flex-1 min-w-0 py-1">
            <p className="text-base font-black text-hello-black truncate leading-tight font-display">
              {currentTrack.title}
            </p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[9px] font-black text-pink-deep/40 uppercase tracking-[0.2em]">
                {currentTrack.category || "Studio Session"}
              </p>
              <span className="text-[9px] font-black text-hello-black/30 tracking-widest">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button 
              onClick={togglePlay}
              className="w-12 h-12 bg-hello-black text-white flex items-center justify-center hover:bg-pink-candy transition-all shadow-notebook active:translate-y-0.5"
            >
              {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="ml-1" />}
            </button>

            <div className="flex flex-col gap-1 ml-1">
              <Link 
                to="/lofi"
                className="p-1.5 text-hello-black/20 hover:text-pink-candy transition-colors"
                title="Plein écran"
              >
                <Maximize2 size={16} />
              </Link>
              <button 
                onClick={stop}
                className="p-1.5 text-hello-black/20 hover:text-pink-candy transition-colors"
                title="Fermer"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Volume - Only visible on hover */}
        <motion.div 
          initial={{ height: 0, opacity: 0, marginTop: 0 }}
          whileHover={{ height: 'auto', opacity: 1, marginTop: 16 }}
          className="overflow-hidden flex items-center gap-4 border-t border-pink-milk/20"
        >
          <Volume2 size={14} className="text-pink-deep/30 shrink-0 mt-3" />
          <div className="flex-1 h-0.5 bg-pink-milk/30 relative mt-3">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <motion.div 
              className="h-full bg-pink-candy/50"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
