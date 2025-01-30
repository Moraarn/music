"use client";

import { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Music2,
  Heart,
  Repeat,
  Shuffle,
  VolumeX,
} from "lucide-react";
import Link from "next/link";

interface Song {
  id: number;
  title: string;
  artist: string;
  url: string;
  coverArt: string;
  genre: string;
}

const songs: Song[] = [
  {
    id: 1,
    title: "Chill Jazz",
    artist: "Sonic Pi",
    genre: "Jazz",
    url: "chill_jazz.wav",
    coverArt:
      "https://images.unsplash.com/photo-1616356607338-fd87169ecf1a?w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Gentle Ocean",
    artist: "Zen Sounds",
    genre: "Nature",
    url: "https://cdn.pixabay.com/download/audio/2022/03/09/audio_c8c8a73467.mp3",
    coverArt:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Summer Walk",
    artist: "Olexy",
    genre: "Lo-fi",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
    coverArt:
      "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Dreamy Waves",
    artist: "AudioCoffee",
    genre: "Ambient",
    url: "https://cdn.pixabay.com/download/audio/2023/05/15/audio_7b8d0e44d8.mp3",
    coverArt:
      "https://images.unsplash.com/photo-1520690214124-2405c5217036?w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Morning Light",
    artist: "SergeQuadrado",
    genre: "Piano",
    url: "https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc7a1d75.mp3",
    coverArt:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Peaceful Garden",
    artist: "Ambient Labs",
    genre: "Nature",
    url: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_347289021d.mp3",
    coverArt:
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop",
  },
];

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song>(songs[0]);
  const [volume, setVolume] = useState([0.5]);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState([0]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const previousVolume = useRef(volume[0]);

  useEffect(() => {
    audioRef.current = new Audio(currentSong.url);
    audioRef.current.volume = isMuted ? 0 : volume[0];
    
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress([progress]);
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };

    const handleEnded = () => {
      if (isRepeating) {
        audioRef.current?.play();
      } else {
        playNext();
      }
    };

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioRef.current.addEventListener('ended', handleEnded);
    
    if (isPlaying) {
      audioRef.current.play();
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.pause();
      }
    };
  }, [currentSong, isPlaying, isRepeating]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0];
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume([previousVolume.current]);
    } else {
      previousVolume.current = volume[0];
      setVolume([0]);
    }
    setIsMuted(!isMuted);
  };

  const playNext = () => {
    if (isShuffled) {
      const availableSongs = songs.filter(song => song.id !== currentSong.id);
      const randomSong = availableSongs[Math.floor(Math.random() * availableSongs.length)];
      setCurrentSong(randomSong);
    } else {
      const currentIndex = songs.findIndex(song => song.id === currentSong.id);
      const nextIndex = (currentIndex + 1) % songs.length;
      setCurrentSong(songs[nextIndex]);
    }
  };

  const playPrevious = () => {
    if (isShuffled) {
      const availableSongs = songs.filter(song => song.id !== currentSong.id);
      const randomSong = availableSongs[Math.floor(Math.random() * availableSongs.length)];
      setCurrentSong(randomSong);
    } else {
      const currentIndex = songs.findIndex(song => song.id === currentSong.id);
      const previousIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
      setCurrentSong(songs[previousIndex]);
    }
  };

  const handleProgressChange = (newProgress: number[]) => {
    if (audioRef.current) {
      const time = (newProgress[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
      setProgress(newProgress);
    }
  };

  const handleSongSelect = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary p-8 relative">
      {/* Create Song Button */}
      <Link href="/pages/form" passHref>
        <Button
          size="lg"
          variant="secondary"
          className="absolute top-8 right-8 z-10 px-6 py-2"
        >
          Create Song
        </Button>
      </Link>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Harmony Player
          </h1>
          <p className="text-muted-foreground text-lg">Your personal music companion</p>
        </div>

        <div className="grid lg:grid-cols-[400px,1fr] gap-8">
          <Card className="p-6 backdrop-blur-sm bg-card/50">
            <h2 className="font-semibold mb-6 flex items-center gap-2 text-lg">
              <Music2 className="w-5 h-5" />
              Your Library
            </h2>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {songs.map((song) => (
                  <button
                    key={song.id}
                    onClick={() => handleSongSelect(song)}
                    className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all hover:bg-primary/5 ${
                      currentSong.id === song.id ? 'bg-primary/10 scale-[1.02]' : ''
                    }`}
                  >
                    <img
                      src={song.coverArt}
                      alt={song.title}
                      className="w-16 h-16 rounded-lg object-cover shadow-md"
                    />
                    <div className="text-left flex-1">
                      <p className="font-medium text-lg">{song.title}</p>
                      <p className="text-sm text-muted-foreground">{song.artist}</p>
                      <p className="text-xs text-muted-foreground mt-1">{song.genre}</p>
                    </div>
                    {currentSong.id === song.id && isPlaying && (
                      <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>

          <Card className="p-8 backdrop-blur-sm bg-card/50">
            <div className="flex flex-col h-full justify-between gap-8">
              <div className="text-center space-y-8">
                <div className="relative group">
                  <img
                    src={currentSong.coverArt}
                    alt={currentSong.title}
                    className="w-64 h-64 rounded-2xl mx-auto object-cover shadow-xl group-hover:shadow-2xl transition-all duration-300"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">{currentSong.title}</h2>
                  <p className="text-lg text-muted-foreground">{currentSong.artist}</p>
                  <p className="text-sm text-muted-foreground mt-1">{currentSong.genre}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Slider
                    value={progress}
                    onValueChange={handleProgressChange}
                    max={100}
                    step={0.1}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-center gap-6">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsShuffled(!isShuffled)}
                      className={isShuffled ? "text-primary" : ""}
                    >
                      <Shuffle className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={playPrevious}
                      className="hover:scale-110 transition-transform"
                    >
                      <SkipBack className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      onClick={togglePlay}
                      className="h-14 w-14 rounded-full hover:scale-110 transition-transform"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={playNext}
                      className="hover:scale-110 transition-transform"
                    >
                      <SkipForward className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsRepeating(!isRepeating)}
                      className={isRepeating ? "text-primary" : ""}
                    >
                      <Repeat className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-4 px-8">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={toggleMute}
                      className="shrink-0"
                    >
                      {isMuted || volume[0] === 0 ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </Button>
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={1}
                      step={0.01}
                      className="w-32 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}