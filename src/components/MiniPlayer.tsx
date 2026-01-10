import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Music, X, Volume2, Maximize2, Minimize2 } from 'lucide-react';
import { useMusic } from '../contexts/MusicContext';
import { Link } from 'react-router-dom';

const MiniPlayer = () => {
  const { currentTrack, isPlaying, togglePlay, stop, volume, setVolume, currentTime, duration, seek } = useMusic();
  const [isMinimized, setIsMinimized] = useState(false);

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence mode="wait">
      {isMinimized ? (
        <motion.div
          key="minimized"
          initial={{ scale: 0.5, opacity: 0, x: 20, y: 20 }}
          animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, x: 20, y: 20 }}
          whileHover={{ scale: 1.1, y: -5 }}
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-6 right-6 z-50 cursor-pointer"
        >
          <div className="relative group">
            {/* Outer Progress Ring */}
            <svg className="w-16 h-16 -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-pink-milk/20"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray="188.5"
                animate={{ strokeDashoffset: 188.5 - (188.5 * progress) / 100 }}
                className="text-pink-candy"
              />
            </svg>

            {/* Thumbnail */}
            <div className="absolute inset-1.5 rounded-full overflow-hidden border-2 border-[var(--color-card-bg)] shadow-lg">
              {currentTrack.thumbnail ? (
                <img src={currentTrack.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-pink-milk flex items-center justify-center text-pink-candy">
                  <Music size={16} />
                </div>
              )}
              
              {/* Play/Pause Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {isPlaying ? <Pause size={16} className="text-white fill-white" /> : <Play size={16} className="text-white fill-white ml-0.5" />}
              </div>
            </div>

            {/* Pulse effect if playing */}
            {isPlaying && (
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-full bg-pink-candy/30 -z-10"
              />
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="full"
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          whileHover={{ y: -5 }}
          className="fixed bottom-4 right-4 z-50 flex flex-col chic-card p-2.5 min-w-[280px] group overflow-hidden"
        >
          {/* Progress Bar - Minimalist */}
          <div className="absolute top-0 left-0 w-full h-1 bg-pink-milk/20 overflow-hidden">
            <motion.div 
              className="h-full bg-pink-candy relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </motion.div>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
          </div>

          <div className="flex items-center gap-2.5 mt-1">
            {/* Thumbnail - Rounded & Modern */}
            <Link to="/lofi" className="relative group/thumb shrink-0">
              <motion.div 
                animate={isPlaying ? { 
                  scale: [1, 1.02, 1],
                  rotate: [0, 1, -1, 0]
                } : {}}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border-2 border-pink-candy/10"
              >
                <div className="w-full h-full bg-pink-milk/20 relative">
                  {currentTrack.thumbnail ? (
                    <img src={currentTrack.thumbnail} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-pink-candy/40">
                      <Music size={16} />
                    </div>
                  )}
                </div>
              </motion.div>
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0 py-0.5">
              <h4 className="text-[11px] font-black text-hello-black truncate leading-tight font-display uppercase tracking-wider">
                {currentTrack.title}
              </h4>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-[7px] font-black text-pink-deep/40 uppercase tracking-[0.3em]">
                  {currentTrack.category || "Studio Session"}
                </p>
                <span className="text-[7px] font-black text-hello-black/20 tracking-widest">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Controls - Rounded & Chic */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={togglePlay}
                className="w-8 h-8 bg-hello-black text-white rounded-xl flex items-center justify-center hover:bg-pink-candy hover:text-hello-black hover:scale-105 transition-all shadow-xl shadow-hello-black/10 active:scale-95 border-2 border-transparent"
              >
                {isPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" className="ml-0.5" />}
              </button>

              <div className="flex flex-col gap-0.5 ml-0.5">
                <div className="flex gap-0.5">
                  <button 
                    onClick={() => setIsMinimized(true)}
                    className="p-1 text-hello-black/20 hover:text-pink-candy hover:bg-pink-milk/50 rounded-lg transition-all border-2 border-transparent hover:border-pink-candy/10"
                    title="Réduire"
                  >
                    <Minimize2 size={12} />
                  </button>
                  <Link 
                    to="/lofi"
                    className="p-1 text-hello-black/20 hover:text-pink-candy hover:bg-pink-milk/50 rounded-lg transition-all border-2 border-transparent hover:border-pink-candy/10"
                    title="Plein écran"
                  >
                    <Maximize2 size={12} />
                  </Link>
                </div>
                <button 
                  onClick={stop}
                  className="p-1 text-hello-black/20 hover:text-pink-candy hover:bg-pink-milk/50 rounded-lg transition-all border-2 border-transparent hover:border-pink-candy/10"
                  title="Fermer"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Volume - Modern Slider */}
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            whileHover={{ height: 'auto', opacity: 1 }}
            className="overflow-hidden group-hover:mt-2.5 transition-all duration-500"
          >
            <div className="flex items-center gap-2 border-t-2 border-pink-milk/10 pt-2">
              <Volume2 size={10} className="text-pink-deep/30 shrink-0" />
              <div className="flex-1 h-1 bg-pink-milk/20 rounded-full relative overflow-hidden">
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
                  className="h-full bg-pink-candy"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(MiniPlayer);
