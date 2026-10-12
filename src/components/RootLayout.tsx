import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAudio } from "@/context/AudioContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  SpeakerHigh, 
  SpeakerX, 
  List as MenuIcon, 
  X as CloseIcon, 
  MusicNotes, 
  ArrowUpRight,
  User as UserIcon,
  SignOut as SignOutIcon,
  Plus as PlusIcon,
  Trash as TrashIcon,
  LockSimple as LockIcon,
  Waveform as WaveformIcon
} from "@phosphor-icons/react";
import { Toaster, toast } from "sonner";

export const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    playlist,
    currentTrack,
    isPlaying,
    progress,
    currentTime,
    duration,
    volume,
    isMuted,
    playPause,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
    toggleMute,
    playTrack,
    premiumModalOpen,
    setPremiumModalOpen
  } = useAudio();

  const {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    showAuthModal,
    setShowAuthModal
  } = useAuth();

  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [volumeHovered, setVolumeHovered] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);

  // Auth modal form states
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authUsername, setAuthUsername] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  // Format time (e.g. 135 -> "2:15")
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const navLinks = [
    { name: "Music", path: "/music" },
    { name: "Composer", path: "/composer" },
    { name: "Composition", path: "/composition" },
    { name: "Free Use", path: "/free-use" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleListenClick = () => {
    if (!currentTrack) {
      playTrack("book-of-spells");
    } else {
      playPause();
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-foreground selection:bg-white selection:text-black font-sans">
      {/* 1. Grain/Paper Texture Overlay */}
      <div className="grain-overlay" />

      {/* 2. Background Animated Staff Lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="staff-lines-container absolute top-1/4 left-0 right-0 h-24 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <line x1="0" y1="20" x2="1000" y2="20" className="animated-staff-line" />
            <line x1="0" y1="35" x2="1000" y2="35" className="animated-staff-line" />
            <line x1="0" y1="50" x2="1000" y2="50" className="animated-staff-line" />
            <line x1="0" y1="65" x2="1000" y2="65" className="animated-staff-line" />
            <line x1="0" y1="80" x2="1000" y2="80" className="animated-staff-line" />
          </svg>
        </div>
        <div className="staff-lines-container absolute bottom-1/4 left-0 right-0 h-24 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <line x1="0" y1="20" x2="1000" y2="20" className="animated-staff-line-delayed" />
            <line x1="0" y1="35" x2="1000" y2="35" className="animated-staff-line-delayed" />
            <line x1="0" y1="50" x2="1000" y2="50" className="animated-staff-line-delayed" />
            <line x1="0" y1="65" x2="1000" y2="65" className="animated-staff-line-delayed" />
            <line x1="0" y1="80" x2="1000" y2="80" className="animated-staff-line-delayed" />
          </svg>
        </div>
      </div>

      {/* 3. Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/70 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-8">
          {/* Logo */}
          <Link 
            to="/" 
            onClick={handleLinkClick}
            className="group flex flex-col tracking-[0.25em] transition-opacity hover:opacity-80"
          >
            <span className="font-display text-lg font-bold text-white">T4MH</span>
            <span className="font-sans text-[8px] uppercase tracking-[0.4em] text-muted-foreground transition-colors group-hover:text-white">
              Music Studio
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className={`font-display text-xs uppercase tracking-[0.2em] transition-colors hover:text-white ${
                    isActive ? "text-white font-medium" : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Nav Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleListenClick}
              className="hidden sm:flex items-center gap-2 border border-white/10 px-5 py-2.5 font-display text-[11px] uppercase tracking-[0.25em] text-white transition-all hover:bg-white hover:text-black active:scale-[0.98]"
            >
              <span className="relative flex h-2 w-2">
                {isPlaying && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              {isPlaying ? "PAUSE" : "LISTEN"}
            </button>

            {/* User Auth Section */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-2 border border-white/10 px-4 py-2.5 bg-white/5">
                  <UserIcon size={14} className="text-white" />
                  <span className="font-display text-[10px] uppercase tracking-wider text-white">
                    {user?.username}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="text-muted-foreground hover:text-white transition-colors p-2"
                  title="Logout"
                >
                  <SignOutIcon size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode("login");
                  setShowAuthModal(true);
                }}
                className="hidden sm:flex items-center gap-2 border border-white/10 px-5 py-2.5 font-display text-[11px] uppercase tracking-[0.25em] text-white transition-all hover:bg-white hover:text-black active:scale-[0.98]"
              >
                <UserIcon size={14} />
                LOGIN
              </button>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex lg:hidden text-white hover:text-white/80 p-1"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-20 z-40 flex flex-col bg-black/95 backdrop-blur-lg border-t border-white/5 lg:hidden animate-in fade-in duration-300">
            <nav className="flex flex-col gap-6 px-8 py-12">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={handleLinkClick}
                    className={`font-display text-lg uppercase tracking-[0.25em] transition-colors py-2 border-b border-white/5 ${
                      isActive ? "text-white border-white/20" : "text-muted-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  handleListenClick();
                  setMobileMenuOpen(false);
                }}
                className="mt-8 flex items-center justify-center gap-3 border border-white/20 py-4 font-display text-xs uppercase tracking-[0.25em] text-white"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? "PAUSE COMPOSITION" : "ENTER THE MUSIC"}
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* 4. Main Page Content wrapper */}
      <main className="relative z-10 pt-20 pb-16 flex flex-col justify-between min-h-[calc(100vh-80px)]">
        <div className="flex-1">
          {children}
        </div>
        
        {/* FOOTER */}
        <footer className="border-t border-white/5 bg-black py-12 mt-20">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
              <div>
                <span className="font-display text-sm font-bold tracking-[0.25em] text-white">T4MH MUSIC</span>
                <p className="font-sans text-xs text-muted-foreground uppercase tracking-widest mt-1">
                  Original Music & Composition
                </p>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="font-display text-[10px] uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-muted-foreground">
              <p className="font-sans text-[10px] uppercase tracking-widest">
                © {new Date().getFullYear()} T4MH Music. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link 
                  to="/free-use" 
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="font-sans text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                >
                  Non-Commercial Usage Policy
                </Link>
                <Link 
                  to="/contact" 
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="font-sans text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                >
                  Contact Keith
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* 5. Persistent Custom Audio Player */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-black/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-8 md:py-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            
            {/* Track metadata */}
            <div className="flex items-center gap-3.5 min-w-[200px]">
              <div className="relative group size-12 flex-shrink-0 bg-neutral-900 overflow-hidden border border-white/10">
                {currentTrack?.coverUrl ? (
                  <img 
                    src={currentTrack.coverUrl} 
                    alt={currentTrack.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <MusicNotes size={20} className="text-muted-foreground" />
                  </div>
                )}
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-[3px] px-2.5">
                    <span className="w-[3px] h-3 bg-white waveform-bar" style={{ animationDelay: "0.1s" }} />
                    <span className="w-[3px] h-4 bg-white waveform-bar" style={{ animationDelay: "0.3s" }} />
                    <span className="w-[3px] h-2 bg-white waveform-bar" style={{ animationDelay: "0.5s" }} />
                    <span className="w-[3px] h-3 bg-white waveform-bar" style={{ animationDelay: "0.2s" }} />
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-display text-xs font-semibold text-white tracking-wider truncate uppercase">
                  {currentTrack?.title || "Archive Closed"}
                </h4>
                <p className="font-sans text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5 truncate">
                  {currentTrack?.category || "T4MH Original"}
                </p>
              </div>
            </div>

            {/* Central Playback Controls & Progress */}
            <div className="flex flex-1 flex-col gap-2.5 max-w-2xl px-2">
              <div className="flex items-center justify-center gap-6">
                <button 
                  onClick={prevTrack}
                  className="text-muted-foreground hover:text-white transition-colors p-1"
                  aria-label="Previous track"
                >
                  <SkipBack size={18} weight="fill" />
                </button>
                <button 
                  onClick={playPause}
                  className="size-10 rounded-full border border-white/10 hover:border-white/40 bg-white/5 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all duration-300 active:scale-95"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause size={16} weight="fill" />
                  ) : (
                    <Play size={16} weight="fill" className="translate-x-[1px]" />
                  )}
                </button>
                <button 
                  onClick={nextTrack}
                  className="text-muted-foreground hover:text-white transition-colors p-1"
                  aria-label="Next track"
                >
                  <SkipForward size={18} weight="fill" />
                </button>
              </div>

              {/* Progress Bar & Timers */}
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-muted-foreground min-w-[32px] text-right">
                  {formatTime(currentTime)}
                </span>
                <div 
                  className="relative flex-1 h-1 bg-white/10 hover:h-1.5 transition-all cursor-pointer group"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percentage = (clickX / rect.width) * 100;
                    seekTo(percentage);
                  }}
                >
                  <div 
                    className="absolute top-0 left-0 h-full bg-white transition-all duration-700" 
                    style={{ width: `${progress}%`, transition: isPlaying ? "none" : "all 0.3s" }}
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 bg-white scale-0 group-hover:scale-100 transition-transform duration-150"
                    style={{ left: `calc(${progress}% - 5px)` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground min-w-[32px]">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Side Volume Controls & Playlist Trigger */}
            <div className="hidden md:flex items-center justify-end gap-5 min-w-[200px]">
              {/* Volume Slider */}
              <div 
                className="flex items-center gap-2"
                onMouseEnter={() => setVolumeHovered(true)}
                onMouseLeave={() => setVolumeHovered(false)}
              >
                <button 
                  onClick={toggleMute}
                  className="text-muted-foreground hover:text-white transition-colors p-1"
                  aria-label="Toggle mute"
                >
                  {isMuted || volume === 0 ? (
                    <SpeakerX size={18} />
                  ) : (
                    <SpeakerHigh size={18} />
                  )}
                </button>
                <div className={`flex items-center h-1 bg-white/10 transition-all duration-300 ${volumeHovered ? "w-20" : "w-12"}`}>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    aria-label="Volume"
                    className="w-full h-full appearance-none bg-transparent cursor-pointer accent-white [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:bg-white"
                  />
                </div>
              </div>

              {/* Show Playlist Panel button */}
              <div className="relative">
                <button
                  onClick={() => setPlaylistOpen(!playlistOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 border font-display text-[10px] uppercase tracking-wider transition-colors ${
                    playlistOpen ? "bg-white text-black border-white" : "border-white/10 text-muted-foreground hover:text-white"
                  }`}
                >
                  <MusicNotes size={12} />
                  QUEUE
                </button>

                {/* Playlist Mini-Drawer */}
                {playlistOpen && (
                  <div className="absolute bottom-12 right-0 w-72 bg-neutral-950 border border-white/10 p-4 shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                      <span className="font-display text-[10px] uppercase tracking-widest text-muted-foreground">Composer Playlist</span>
                      <span className="font-mono text-[9px] text-muted-foreground uppercase">T4MH Archive</span>
                    </div>
                    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                      {playlist.map((track, idx) => {
                        const isCurrent = currentTrack?.id === track.id;
                        return (
                          <button
                            key={track.id}
                            onClick={() => {
                              playTrack(track.id);
                              setPlaylistOpen(false);
                            }}
                            className={`flex items-center justify-between p-2 hover:bg-white/5 transition-colors text-left ${
                              isCurrent ? "bg-white/5 border-l-2 border-white" : ""
                            }`}
                          >
                            <div className="overflow-hidden pr-2">
                              <p className={`font-display text-[11px] uppercase tracking-wider truncate ${isCurrent ? "text-white" : "text-neutral-400"}`}>
                                {track.title}
                              </p>
                              <p className="font-sans text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">
                                {track.category}
                              </p>
                            </div>
                            <span className="font-mono text-[10px] text-muted-foreground">{track.duration}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Premium Subscription Pop-up Modal */}
      <AnimatePresence>
        {premiumModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPremiumModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl bg-neutral-950 border border-white/10 p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setPremiumModalOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-muted-foreground hover:text-white transition-colors p-1"
                aria-label="Close modal"
              >
                <CloseIcon size={20} />
              </button>

              {/* Header */}
              <div className="text-center mb-10">
                <span className="font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">T4MH ARCHIVE PASS</span>
                <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-widest uppercase mt-2">
                  Unlock Premium Access
                </h2>
                <div className="w-12 h-[1px] bg-white/20 mx-auto my-4" />
                <p className="font-sans text-xs md:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed font-light">
                  You have completed your 15-second preview. Support human artistry and unlock high-fidelity, uncompressed playback across our entire musical archive.
                </p>
              </div>

              {/* 3 Packages Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Package 1: Curator */}
                <div className="flex flex-col justify-between border border-white/5 p-6 bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
                  <div>
                    <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">T4MH CURATOR</span>
                    <h3 className="text-lg font-bold text-white tracking-wider uppercase mt-1">Curator Pass</h3>
                    <div className="my-4">
                      <span className="font-mono text-2xl font-bold text-white">$9</span>
                      <span className="font-sans text-xs text-muted-foreground"> / month</span>
                    </div>
                    <ul className="space-y-2.5 my-6 text-xs font-light text-muted-foreground leading-relaxed border-t border-white/5 pt-4">
                      <li className="flex items-start gap-2">
                        <span className="text-white">•</span>
                        <span>Unlimited high-quality streaming (320kbps MP3)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-white">•</span>
                        <span>100% ad-free listening across all devices</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-white">•</span>
                        <span>Access to exclusive composer notes & commentary</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setPremiumModalOpen(false);
                      toast.success("Welcome, Curator! Thank you for supporting T4MH Music.");
                    }}
                    className="w-full py-2.5 border border-white/10 hover:border-white text-white font-display text-xs uppercase tracking-wider transition-colors bg-transparent hover:bg-white hover:text-black mt-4"
                  >
                    Subscribe Now
                  </button>
                </div>

                {/* Package 2: Acolyte (Most Popular) */}
                <div className="relative flex flex-col justify-between border border-white p-6 bg-white/[0.02] shadow-[0_0_30px_rgba(255,255,255,0.03)]">
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white text-black font-display text-xs uppercase tracking-[0.25em] px-3 py-1 font-semibold">
                    MOST POPULAR
                  </span>
                  <div>
                    <span className="font-display text-xs uppercase tracking-widest text-white/60">T4MH ACOLYTE</span>
                    <h3 className="text-lg font-bold text-white tracking-wider uppercase mt-1">Acolyte Pass</h3>
                    <div className="my-4">
                      <span className="font-mono text-2xl font-bold text-white">$19</span>
                      <span className="font-sans text-xs text-muted-foreground"> / month</span>
                    </div>
                    <ul className="space-y-2.5 my-6 text-xs font-light text-muted-foreground leading-relaxed border-t border-white/10 pt-4">
                      <li className="flex items-start gap-2">
                        <span className="text-white">•</span>
                        <span><strong>Everything in Curator Pass</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-white">•</span>
                        <span>Lossless audio streaming (FLAC / 24-bit WAV)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-white">•</span>
                        <span>Personal non-commercial license for independent creators</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-white">•</span>
                        <span>Access to early compositions & unreleased tracks</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setPremiumModalOpen(false);
                      toast.success("Welcome, Acolyte! Your high-fidelity journey begins now.");
                    }}
                    className="w-full py-2.5 bg-white text-black font-display text-xs uppercase tracking-wider transition-colors hover:bg-neutral-200 mt-4"
                  >
                    Subscribe Now
                  </button>
                </div>

                {/* Package 3: Patron */}
                <div className="flex flex-col justify-between border border-white/5 p-6 bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
                  <div>
                    <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">T4MH PATRON</span>
                    <h3 className="text-lg font-bold text-white tracking-wider uppercase mt-1">Patron Pass</h3>
                    <div className="my-4">
                      <span className="font-mono text-2xl font-bold text-white">$49</span>
                      <span className="font-sans text-xs text-muted-foreground"> / month</span>
                    </div>
                    <ul className="space-y-2.5 my-6 text-xs font-light text-muted-foreground leading-relaxed border-t border-white/5 pt-4">
                      <li className="flex items-start gap-2">
                        <span className="text-white">•</span>
                        <span><strong>Everything in Acolyte Pass</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-white">•</span>
                        <span>Full commercial sync license (Film, TV, Games, Ads)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-white">•</span>
                        <span>Downloadable uncompressed multitrack stems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-white">•</span>
                        <span>Direct digital consultation & priority credit</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setPremiumModalOpen(false);
                      toast.success("Welcome, Patron! Thank you for your unparalleled support.");
                    }}
                    className="w-full py-2.5 border border-white/10 hover:border-white text-white font-display text-xs uppercase tracking-wider transition-colors bg-transparent hover:bg-white hover:text-black mt-4"
                  >
                    Subscribe Now
                  </button>
                </div>

              </div>

              {/* Guarantee text */}
              <p className="font-sans text-xs text-muted-foreground text-center uppercase tracking-widest mt-8 font-light">
                Secure checkout. Cancel anytime. 100% of proceeds go directly to support composer Keith.
              </p>

              {/* Cancel / Close button at bottom */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setPremiumModalOpen(false)}
                  className="px-8 py-2.5 border border-white/10 hover:border-white text-muted-foreground hover:text-white font-display text-xs uppercase tracking-widest transition-colors bg-transparent"
                >
                  Cancel / Return to Player
                </button>
              </div>

            </motion.div>
          </div>
        )}

        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-neutral-950 border border-white/10 p-8 shadow-2xl"
            >
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors p-1"
                aria-label="Close modal"
              >
                <CloseIcon size={20} />
              </button>

              <div className="text-center mb-6">
                <span className="font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">T4MH STUDIO</span>
                <h2 className="text-xl md:text-2xl font-semibold text-white tracking-widest uppercase mt-2">
                  {authMode === "login" ? "Studio Access" : "Create Account"}
                </h2>
                <div className="w-12 h-[1px] bg-white/20 mx-auto my-3" />
              </div>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (authMode === "login") {
                    const success = login(authUsername, authPassword);
                    if (success) {
                      setAuthUsername("");
                      setAuthPassword("");
                    }
                  } else {
                    const success = register(authUsername, authEmail, authPassword);
                    if (success) {
                      setAuthUsername("");
                      setAuthEmail("");
                      setAuthPassword("");
                    }
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                    Username / ID
                  </label>
                  <input
                    type="text"
                    required
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full bg-neutral-900 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-white/30 transition-all"
                  />
                </div>

                {authMode === "register" && (
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-neutral-900 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-white/30 transition-all"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-neutral-900 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-white/30 transition-all"
                  />
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(false)}
                    className="flex-1 py-3 border border-white/10 hover:border-white/30 text-white font-display text-xs uppercase tracking-widest transition-colors bg-transparent hover:bg-white/5 font-medium"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-3 bg-white text-black font-display text-xs uppercase tracking-widest transition-colors hover:bg-neutral-200 font-medium"
                  >
                    {authMode === "login" ? "ENTER STUDIO" : "REGISTER PROFILE"}
                  </button>
                </div>
              </form>

              {/* Mode Toggle */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setAuthMode(authMode === "login" ? "register" : "login");
                  }}
                  className="font-sans text-[11px] text-muted-foreground hover:text-white transition-colors uppercase tracking-wider"
                >
                  {authMode === "login" ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                </button>
              </div>

              {/* Demo Credentials Helper (High clarity for testing) */}
              <div className="mt-6 border-t border-white/5 pt-4 text-center">
                <p className="font-sans text-[9px] uppercase tracking-widest text-neutral-500">
                  Quick Access Demo Credentials
                </p>
                <div className="flex justify-center gap-4 mt-2 text-[10px] font-mono text-muted-foreground">
                  <button
                    onClick={() => {
                      setAuthUsername("admin");
                      setAuthPassword("composer123");
                      setAuthMode("login");
                      toast.success("Loaded admin demo credentials!");
                    }}
                    className="hover:text-white border border-white/5 hover:border-white/20 px-2 py-1 bg-white/[0.02]"
                  >
                    admin / composer123
                  </button>
                  <button
                    onClick={() => {
                      setAuthUsername("keith");
                      setAuthPassword("piano123");
                      setAuthMode("login");
                      toast.success("Loaded keith demo credentials!");
                    }}
                    className="hover:text-white border border-white/5 hover:border-white/20 px-2 py-1 bg-white/[0.02]"
                  >
                    keith / piano123
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toaster theme="dark" closeButton />
    </div>
  );
};
