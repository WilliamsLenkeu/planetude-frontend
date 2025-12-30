import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { LoFiTrack } from '../types';

interface MusicContextType {
  currentTrack: LoFiTrack | null;
  isPlaying: boolean;
  playTrack: (track: LoFiTrack) => void;
  togglePlay: () => void;
  stop: () => void;
  volume: number;
  setVolume: (v: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<LoFiTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [audio] = useState(new Audio());

  useEffect(() => {
    audio.volume = volume;
  }, [volume, audio]);

  useEffect(() => {
    if (currentTrack?.url) {
      audio.src = currentTrack.url;
      if (isPlaying) {
        audio.play().catch(e => console.error("Erreur lecture audio:", e));
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (isPlaying && currentTrack) {
      audio.play().catch(e => console.error("Erreur lecture audio:", e));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  const playTrack = (track: LoFiTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const stop = () => {
    setIsPlaying(false);
    setCurrentTrack(null);
    audio.pause();
    audio.src = "";
  };

  return (
    <MusicContext.Provider value={{ 
      currentTrack, 
      isPlaying, 
      playTrack, 
      togglePlay, 
      stop,
      volume,
      setVolume
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
