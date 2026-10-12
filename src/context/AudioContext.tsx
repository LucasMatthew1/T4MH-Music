import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export interface Track {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string; // Display duration
  src: string;
  coverUrl: string;
}

// Initial high-quality tracks using downloaded files and images
export const PLAYLIST: Track[] = [
  {
    id: "book-of-spells",
    title: "Book of Spells",
    category: "Symphonic / Cinematic",
    description: "An evocative, orchestration-driven journey through mystery and ancient lore. Whispering piano motifs build into a powerful, sweeping string climax.",
    duration: "6:12",
    src: "/Theme_1.mp3",
    coverUrl: "/assets/piano-sheet.jpg"
  },
  {
    id: "haunted",
    title: "Haunted",
    category: "Instrumental / Rock",
    description: "A dark, atmospheric rock composition combining ambient electric guitar soundscapes with a heavy, driving rhythmic heartbeat.",
    duration: "7:05",
    src: "/Theme_2.mp3",
    coverUrl: "/assets/piano-notes.jpg"
  },
  {
    id: "revelation",
    title: "Revelation",
    category: "Symphonic / Cinematic",
    description: "A slow-building, awe-inspiring orchestral piece with shimmering brass and sweeping strings, capturing the essence of sudden compositional clarity.",
    duration: "5:24",
    src: "/Theme_3.mp3",
    coverUrl: "/assets/composer.jpg"
  },
  {
    id: "tension-bell",
    title: "Tension Bell",
    category: "Suspense / Dark Ambient",
    description: "A pulsating, nerve-wracking soundscape marked by a repeating metallic resonance and low, rumbling synth pads. Perfect for moments of cinematic suspense.",
    duration: "3:40",
    src: "/Theme_4.mp3",
    coverUrl: "/assets/ink-texture.jpg"
  },
  {
    id: "bright-empire",
    title: "Bright Empire",
    category: "Orchestral / Epic",
    description: "A grand, triumphant theme representing hope, expansion, and noble achievements. Driven by soaring french horns and a kinetic percussion pattern.",
    duration: "4:50",
    src: "/Theme_5.mp3",
    coverUrl: "/assets/piano-sheet.jpg"
  },
  {
    id: "lament",
    title: "Lament",
    category: "Cinematic / Film & TV",
    description: "A sorrowful cello melody set against a backdrop of distant, echoing strings and gentle piano drops, expressing deep emotional longing.",
    duration: "4:15",
    src: "/Theme_6.mp3",
    coverUrl: "/assets/piano-notes.jpg"
  },
  {
    id: "passion-and-sorrow",
    title: "Passion and Sorrow",
    category: "Classical / Melancholic",
    description: "A passionate violin concerto that transitions between moments of intense, driving sorrow and soft, reflective piano peace.",
    duration: "5:08",
    src: "/Theme_7.mp3",
    coverUrl: "/assets/composer.jpg"
  },
  {
    id: "urban-suspense",
    title: "Urban Suspense",
    category: "Dark Ambient / Modern",
    description: "Gritty synthesizer tones and industrial rhythmic ticks paint a vivid picture of a dark, sleepless metropolis full of unspoken secrets.",
    duration: "4:02",
    src: "/Theme_8.mp3",
    coverUrl: "/assets/ink-texture.jpg"
  },
  {
    id: "babylon",
    title: "Babylon",
    category: "World / Experimental",
    description: "An ancient-sounding fusion of middle-eastern wind instruments, hand percussion, and modern cinematic sub-bass design.",
    duration: "5:30",
    src: "/Theme_9.mp3",
    coverUrl: "/assets/piano-sheet.jpg"
  },
  {
    id: "heavens-mystery",
    title: "Heaven's Mystery",
    category: "Ethereal / Vocal",
    description: "Heavenly vocal pads layered with a sparkling, starlit harp arrangement. Evokes a sense of floating in the endless, mysterious cosmos.",
    duration: "6:45",
    src: "/Theme_10.mp3",
    coverUrl: "/assets/piano-notes.jpg"
  },
  {
    id: "impending",
    title: "Impending",
    category: "Symphonic / Action",
    description: "A ticking, high-tempo rhythm with stabbing string sections. Represents a countdown to an unavoidable cinematic event.",
    duration: "3:15",
    src: "/Theme_11.mp3",
    coverUrl: "/assets/composer.jpg"
  },
  {
    id: "metro",
    title: "Metro",
    category: "Electronic / Industrial",
    description: "Subterranean basslines and clicking train-track rhythms, capturing the perpetual, rhythmic movement of underground metropolitan travel.",
    duration: "4:40",
    src: "/Theme_12.mp3",
    coverUrl: "/assets/ink-texture.jpg"
  }
];

interface AudioContextType {
  playlist: Track[];
  currentTrack: Track | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  progress: number; // 0 to 100
  currentTime: number; // in seconds
  duration: number; // in seconds
  volume: number; // 0 to 1
  isMuted: boolean;
  premiumModalOpen: boolean;
  recentlyPlayed: Track[];
  setPremiumModalOpen: (open: boolean) => void;
  playTrack: (trackId: string) => void;
  playPause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (percentage: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [premiumModalOpen, setPremiumModalOpenState] = useState<boolean>(false);

  const setPremiumModalOpen = (open: boolean) => {
    setPremiumModalOpenState(open);
    if (!open) {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        setCurrentTime(0);
        setProgress(0);
      }
    }
  };

  const [recentlyPlayedIds, setRecentlyPlayedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("t4mh_recently_played");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Save recently played to localStorage
  useEffect(() => {
    localStorage.setItem("t4mh_recently_played", JSON.stringify(recentlyPlayedIds));
  }, [recentlyPlayedIds]);

  const addToRecentlyPlayed = (trackId: string) => {
    setRecentlyPlayedIds((prev) => {
      const filtered = prev.filter((id) => id !== trackId);
      return [trackId, ...filtered].slice(0, 6); // Keep last 6 tracks
    });
  };

  const recentlyPlayed = recentlyPlayedIds
    .map((id) => PLAYLIST.find((track) => track.id === id))
    .filter((track): track is Track => !!track);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = PLAYLIST[currentTrackIndex] || null;

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const delayNodeRef = useRef<DelayNode | null>(null);
  const delayGainRef = useRef<GainNode | null>(null);

  const initWebAudio = () => {
    if (audioCtxRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const audio = audioRef.current;
      if (!audio) return;

      // Create source node (ONLY ONCE)
      const source = ctx.createMediaElementSource(audio);
      sourceNodeRef.current = source;

      // Create filter node
      const filter = ctx.createBiquadFilter();
      filterNodeRef.current = filter;

      // Create delay node
      const delay = ctx.createDelay(2.0);
      delayNodeRef.current = delay;

      // Create delay gain feedback node
      const delayGain = ctx.createGain();
      delayGainRef.current = delayGain;

      // Setup delay feedback loop
      delay.connect(delayGain);
      delayGain.connect(delay); // loop back

      // Connect source to filter
      source.connect(filter);

      // Connect filter to destination and delay in parallel
      filter.connect(ctx.destination);
      filter.connect(delay);

      // Connect delay output to destination
      delayGain.connect(ctx.destination);
    } catch (e) {
      console.warn("Web Audio API not supported or initialization failed:", e);
    }
  };

  const applyTrackEffects = (track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;

    // Ensure Web Audio is initialized
    initWebAudio();

    // Resume context if suspended (browser security block)
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

    const ctx = audioCtxRef.current;
    const filter = filterNodeRef.current;
    const delay = delayNodeRef.current;
    const delayGain = delayGainRef.current;

    // Default values
    let playbackRate = 1.0;
    let filterType: BiquadFilterType = "allpass";
    let filterFreq = 20000;
    let filterQ = 1;
    let delayTime = 0.0;
    let feedback = 0.0;

    // Customize effects per track to make them sound completely distinct
    switch (track.id) {
      case "book-of-spells":
        // Pure symphonic beauty
        playbackRate = 1.0;
        filterType = "peaking";
        filterFreq = 1000;
        filterQ = 0.5;
        break;
      case "haunted":
        // Dark, heavy, slowed down
        playbackRate = 0.82;
        filterType = "lowpass";
        filterFreq = 1400;
        filterQ = 1.2;
        break;
      case "revelation":
        // High frequency shimmering, faster
        playbackRate = 1.12;
        filterType = "highpass";
        filterFreq = 180;
        break;
      case "tension-bell":
        // Metallic, resonant peak filter
        playbackRate = 0.92;
        filterType = "peaking";
        filterFreq = 3200;
        filterQ = 5.0; // High Q for resonant bell feel
        break;
      case "bright-empire":
        // Bright and crisp, slightly accelerated
        playbackRate = 1.18;
        filterType = "peaking";
        filterFreq = 4500;
        filterQ = 1.2;
        break;
      case "lament":
        // Extremely sorrowful, slowed down, heavy lowpass cello vibes
        playbackRate = 0.78;
        filterType = "lowpass";
        filterFreq = 700;
        filterQ = 1.8;
        break;
      case "passion-and-sorrow":
        // Melancholy filter sweep/bandpass
        playbackRate = 0.88;
        filterType = "bandpass";
        filterFreq = 1100;
        filterQ = 1.0;
        break;
      case "urban-suspense":
        // Gritty, lo-fi radio feel
        playbackRate = 1.05;
        filterType = "bandpass";
        filterFreq = 1700;
        filterQ = 3.0;
        break;
      case "babylon":
        // Echoey cosmic space delay
        playbackRate = 0.96;
        filterType = "allpass";
        delayTime = 0.45;
        feedback = 0.5;
        break;
      case "heavens-mystery":
        // Ethereal and fast-spaced, high-pitch starlit shimmer
        playbackRate = 1.28;
        filterType = "highpass";
        filterFreq = 450;
        delayTime = 0.3;
        feedback = 0.35;
        break;
      case "impending":
        // High-stress countdown, extremely fast
        playbackRate = 1.42;
        filterType = "peaking";
        filterFreq = 2200;
        filterQ = 2.5;
        break;
      case "metro":
        // Subterranean train track delay & bass boost
        playbackRate = 1.02;
        filterType = "lowpass";
        filterFreq = 950;
        delayTime = 0.18;
        feedback = 0.4;
        break;
      default:
        break;
    }

    // Apply values
    audio.playbackRate = playbackRate;

    if (ctx && filter) {
      filter.type = filterType;
      filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);
      filter.Q.setValueAtTime(filterQ, ctx.currentTime);
    }

    if (ctx && delay && delayGain) {
      delay.delayTime.setValueAtTime(delayTime, ctx.currentTime);
      delayGain.gain.setValueAtTime(feedback, ctx.currentTime);
    }
  };

  // Initialize Audio
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    // Set initial volume
    audio.volume = volume;

    const handleTimeUpdate = () => {
      if (!audio) return;

      // Limit playback to 15 seconds for non-premium
      if (audio.currentTime >= 15) {
        audio.pause();
        audio.currentTime = 15;
        setIsPlaying(false);
        setPremiumModalOpen(true);
        setCurrentTime(15);
        setProgress((15 / (audio.duration || 15)) * 100);
        return;
      }

      setCurrentTime(audio.currentTime);
      const dur = audio.duration || 0;
      setDuration(dur);
      if (dur > 0) {
        setProgress((audio.currentTime / dur) * 100);
      } else {
        setProgress(0);
      }
    };

    const handleLoadedMetadata = () => {
      if (!audio) return;
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      handleNext();
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      console.error("Audio playback error");
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Sync track source
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const originallyPlaying = isPlaying;
    
    // Smooth source swap
    audio.src = currentTrack.src;
    audio.load();

    // Apply custom DSP effects for this track
    applyTrackEffects(currentTrack);
    
    if (originallyPlaying) {
      audio.play().catch((err) => {
        console.warn("Playback prevented by browser autoplay policy:", err);
        setIsPlaying(false);
      });
    } else {
      setCurrentTime(0);
      setProgress(0);
    }
  }, [currentTrackIndex]);

  const playTrack = (trackId: string) => {
    const index = PLAYLIST.findIndex((t) => t.id === trackId);
    if (index !== -1) {
      const audio = audioRef.current;
      if (!audio) return;

      addToRecentlyPlayed(trackId);

      if (index === currentTrackIndex) {
        // Just toggle
        if (isPlaying) {
          audio.pause();
        } else {
          if (audio.currentTime >= 15) {
            setPremiumModalOpen(true);
            return;
          }
          audio.play().catch(handlePlayError);
        }
      } else {
        // Change track and play
        setCurrentTrackIndex(index);
        setIsPlaying(true);
        // Play is handled by source-sync useEffect when src loads
        setTimeout(() => {
          audio.play().catch(handlePlayError);
        }, 50);
      }
    }
  };

  const handlePlayError = (err: any) => {
    console.warn("Autoplay block:", err);
    setIsPlaying(false);
    toast("Audio waiting for user interaction.", {
      description: "Click play again to start listening.",
      action: {
        label: "Dismiss",
        onClick: () => {}
      }
    });
  };

  const playPause = () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
    } else {
      if (audio.currentTime >= 15) {
        setPremiumModalOpen(true);
        return;
      }
      audio.play().catch(handlePlayError);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const seekTo = (percentage: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const targetTime = (percentage / 100) * duration;
    if (targetTime >= 15) {
      audio.currentTime = 15;
      setCurrentTime(15);
      setProgress((15 / duration) * 100);
      audio.pause();
      setIsPlaying(false);
      setPremiumModalOpen(true);
      return;
    }

    audio.currentTime = targetTime;
    setCurrentTime(targetTime);
    setProgress(percentage);
  };

  const setVolume = (vol: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const normalizedVol = Math.max(0, Math.min(1, vol));
    audio.volume = isMuted ? 0 : normalizedVol;
    setVolumeState(normalizedVol);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = !isMuted ? 0 : volume;
    setIsMuted(!isMuted);
  };

  return (
    <AudioContext.Provider
      value={{
        playlist: PLAYLIST,
        currentTrack,
        currentTrackIndex,
        isPlaying,
        progress,
        currentTime,
        duration,
        volume,
        isMuted,
        premiumModalOpen,
        recentlyPlayed,
        setPremiumModalOpen,
        playTrack,
        playPause,
        nextTrack: handleNext,
        prevTrack: handlePrev,
        seekTo,
        setVolume,
        toggleMute,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
