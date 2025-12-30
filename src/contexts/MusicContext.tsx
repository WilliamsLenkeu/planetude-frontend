import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { LoFiTrack } from '../types';

interface MusicContextType {
  currentTrack: LoFiTrack | null;
  isPlaying: boolean;
  playTrack: (track: LoFiTrack) => void;
  togglePlay: () => void;
  stop: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  volume: number;
  setVolume: (v: number) => void;
  currentTime: number;
  duration: number;
  seek: (time: number) => void;
  setPlaylist: (tracks: LoFiTrack[]) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<LoFiTrack | null>(null);
  const [playlist, setPlaylist] = useState<LoFiTrack[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audio] = useState(new Audio());

  useEffect(() => {
    audio.volume = volume;
  }, [volume, audio]);

  const nextTrack = () => {
    if (playlist.length === 0 || !currentTrack) return;
    const currentIndex = playlist.findIndex(t => t.url === currentTrack.url);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentTrack(playlist[nextIndex]);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    if (playlist.length === 0 || !currentTrack) return;
    const currentIndex = playlist.findIndex(t => t.url === currentTrack.url);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrack(playlist[prevIndex]);
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (playlist.length > 0) {
        nextTrack();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audio, playlist, currentTrack]);

  useEffect(() => {
    if (currentTrack?.url) {
      audio.src = currentTrack.url;
      setCurrentTime(0);
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
    if (currentTrack?.url === track.url) {
      togglePlay();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const stop = () => {
    setIsPlaying(false);
    setCurrentTrack(null);
    audio.pause();
    audio.src = "";
    setCurrentTime(0);
  };

  const seek = (time: number) => {
    audio.currentTime = time;
    setCurrentTime(time);
  };

  return (
    <MusicContext.Provider value={{ 
      currentTrack, 
      isPlaying, 
      playTrack, 
      togglePlay, 
      stop,
      nextTrack,
      prevTrack,
      volume,
      setVolume,
      currentTime,
      duration,
      seek,
      setPlaylist
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
