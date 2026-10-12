import React, { useState, useMemo, useEffect } from "react";
import { useAudio } from "@/context/AudioContext";
import { useAuth } from "@/context/AuthContext";
import { 
  Play, 
  Pause, 
  MagnifyingGlass, 
  MusicNotes, 
  Plus, 
  Trash, 
  User, 
  ListPlus, 
  Repeat, 
  Shuffle,
  SpeakerHigh,
  SpeakerX,
  LockSimple,
  ArrowRight,
  Info,
  DotsSix
} from "@phosphor-icons/react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { toast } from "sonner";

interface CustomPlaylist {
  id: string;
  name: string;
  description: string;
  trackIds: string[];
}

const Music = () => {
  const { 
    playlist, 
    currentTrack, 
    isPlaying, 
    playTrack, 
    playPause,
    nextTrack,
    prevTrack,
    progress,
    currentTime,
    duration,
    seekTo,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    recentlyPlayed
  } = useAudio();

  const { isAuthenticated, setShowAuthModal, user } = useAuth();
  const reduce = useReducedMotion();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"archive" | "playlists" | "player">("archive");

  // Search & Filters for archive
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Playlists State
  const [playlists, setPlaylists] = useState<CustomPlaylist[]>(() => {
    const saved = localStorage.getItem("t4mh_custom_playlists");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: "default-masterpieces",
        name: "Keith's Masterpieces",
        description: "A hand-curated selection of atmospheric cinematic journeys.",
        trackIds: ["book-of-spells", "haunted", "bright-empire"]
      }
    ];
  });

  // Active playlist view
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>("default-masterpieces");

  // Add-to-playlist state
  const [activeAddMenu, setActiveAddMenu] = useState<string | null>(null);

  // Form states for creating playlist
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDesc, setNewPlaylistDesc] = useState("");

  // Player configurations (Shuffle & Repeat)
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  // Drag and Drop playlist track reordering states
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Save playlists to LocalStorage
  useEffect(() => {
    localStorage.setItem("t4mh_custom_playlists", JSON.stringify(playlists));
  }, [playlists]);

  const categories = [
    "All",
    "Symphonic",
    "Instrumental",
    "Vocal",
    "Rock",
    "Cinematic / Film & TV"
  ];

  // Map category keywords to track genres
  const filteredTracks = useMemo(() => {
    return playlist.filter((track) => {
      const matchesSearch = 
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeCategory === "All") return matchesSearch;

      const categoryLower = activeCategory.toLowerCase();
      if (categoryLower === "cinematic / film & tv") {
        return matchesSearch && (track.category.toLowerCase().includes("cinematic") || track.category.toLowerCase().includes("film") || track.category.toLowerCase().includes("tv"));
      }

      return matchesSearch && track.category.toLowerCase().includes(categoryLower);
    });
  }, [playlist, searchQuery, activeCategory]);

  const selectedPlaylist = useMemo(() => {
    return playlists.find(p => p.id === selectedPlaylistId) || null;
  }, [playlists, selectedPlaylistId]);

  // Playlist track list
  const playlistTracks = useMemo(() => {
    if (!selectedPlaylist) return [];
    return playlist.filter(track => selectedPlaylist.trackIds.includes(track.id));
  }, [selectedPlaylist, playlist]);

  // Format time utility
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Create playlist handler
  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to create playlists.");
      setShowAuthModal(true);
      return;
    }

    if (!newPlaylistName.trim()) {
      toast.error("Please enter a playlist name.");
      return;
    }

    const newPL: CustomPlaylist = {
      id: "pl-" + Math.random().toString(36).substr(2, 9),
      name: newPlaylistName,
      description: newPlaylistDesc || "Custom user-curated collection",
      trackIds: []
    };

    setPlaylists([...playlists, newPL]);
    setSelectedPlaylistId(newPL.id);
    setNewPlaylistName("");
    setNewPlaylistDesc("");
    toast.success(`Playlist "${newPL.name}" created!`);
  };

  // Delete playlist handler
  const handleDeletePlaylist = (id: string, name: string) => {
    if (id === "default-masterpieces") {
      toast.error("Cannot delete default demo playlist.");
      return;
    }
    const filtered = playlists.filter(p => p.id !== id);
    setPlaylists(filtered);
    if (selectedPlaylistId === id) {
      setSelectedPlaylistId("default-masterpieces");
    }
    toast.success(`Deleted playlist "${name}"`);
  };

  // Add/Remove track to/from playlist
  const handleToggleTrackInPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        const exists = p.trackIds.includes(trackId);
        if (exists) {
          toast.success("Track removed from playlist.");
          return { ...p, trackIds: p.trackIds.filter(id => id !== trackId) };
        } else {
          toast.success("Track added to playlist.");
          return { ...p, trackIds: [...p.trackIds, trackId] };
        }
      }
      return p;
    }));
    setActiveAddMenu(null);
  };

  // Play whole playlist
  const handlePlayPlaylist = (pl: CustomPlaylist) => {
    if (pl.trackIds.length === 0) {
      toast.error("Playlist has no tracks yet. Add some first!");
      return;
    }
    // Play first track of the playlist
    playTrack(pl.trackIds[0]);
    toast.success(`Playing playlist: ${pl.name}`);
  };

  // Drag and drop event handlers for playlist track reordering
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.setData("text/plain", index.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex || !selectedPlaylistId) return;

    setPlaylists(prev => prev.map(p => {
      if (p.id === selectedPlaylistId) {
        const newTrackIds = [...p.trackIds];
        const [removed] = newTrackIds.splice(draggedIndex, 1);
        newTrackIds.splice(targetIndex, 0, removed);
        return { ...p, trackIds: newTrackIds };
      }
      return p;
    }));

    setDraggedIndex(null);
    setDragOverIndex(null);
    toast.success("Playlist order updated!");
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-20 animate-in fade-in duration-700 relative z-10">
      
      {/* Background Graphic Watermark */}
      <div className="absolute right-0 top-10 pointer-events-none select-none text-white/[0.01] font-display text-[15rem] leading-none z-0">
        SOUND
      </div>

      {/* Header */}
      <div className="border-b border-white/10 pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground">The Interactive Experience</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-widest uppercase mt-2">
            Soundstage
          </h1>
          <p className="font-sans text-sm text-muted-foreground mt-4 max-w-2xl font-light leading-relaxed">
            Manage your personal collections, explore the symphonic library, or immerse yourself in the high-fidelity studio player dashboard.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border border-white/10 bg-neutral-950 p-1 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("archive")}
            className={`px-4 py-2 font-display text-[10px] uppercase tracking-wider transition-all ${
              activeTab === "archive" ? "bg-white text-black" : "text-muted-foreground hover:text-white"
            }`}
          >
            Archive
          </button>
          <button
            onClick={() => setActiveTab("playlists")}
            className={`px-4 py-2 font-display text-[10px] uppercase tracking-wider transition-all ${
              activeTab === "playlists" ? "bg-white text-black" : "text-muted-foreground hover:text-white"
            }`}
          >
            My Playlists
          </button>
          <button
            onClick={() => setActiveTab("player")}
            className={`px-4 py-2 font-display text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "player" ? "bg-white text-black" : "text-muted-foreground hover:text-white"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full bg-red-500 ${isPlaying ? "animate-ping" : ""}`} />
            Studio Player
          </button>
        </div>
      </div>

      {/* Recently Played Section */}
      {recentlyPlayed && recentlyPlayed.length > 0 && (
        <div className="mb-16 animate-in fade-in slide-in-from-top-4 duration-500 relative z-10 border-b border-white/5 pb-12">
          <h2 className="font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Recently Played
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentlyPlayed.map((track) => {
              const isCurrent = currentTrack?.id === track.id;
              const isPlayingThis = isCurrent && isPlaying;

              return (
                <div 
                  key={`recent-${track.id}`}
                  onClick={() => playTrack(track.id)}
                  className="group relative border border-white/5 bg-neutral-950/40 hover:bg-white/[0.02] hover:border-white/10 p-4 transition-all duration-300 cursor-pointer flex flex-col gap-3"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-neutral-900 border border-white/5">
                    <img 
                      src={track.coverUrl} 
                      alt={track.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="size-10 bg-white text-black rounded-full flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        {isPlayingThis ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" className="translate-x-[0.5px]" />}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-xs uppercase tracking-wider text-white truncate group-hover:text-amber-200 transition-colors">
                      {track.title}
                    </h3>
                    <p className="font-sans text-[10px] text-muted-foreground truncate uppercase tracking-widest mt-0.5">
                      {track.category}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 1: ARCHIVE */}
      {activeTab === "archive" && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Controls: Search & Filter */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center justify-between border-b border-white/5 pb-8">
            {/* Category filters */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 font-display text-[10px] uppercase tracking-wider border transition-all ${
                      isActive
                        ? "bg-white text-black border-white"
                        : "border-white/5 text-muted-foreground hover:text-white hover:border-white/25"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Search input */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
                <MagnifyingGlass size={16} />
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search compositions..."
                aria-label="Search archive"
                className="w-full bg-neutral-950/60 border border-white/10 pl-10 pr-4 py-2.5 font-sans text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
              />
            </div>
          </div>

          {/* Compositions List */}
          {filteredTracks.length > 0 ? (
            <div className="flex flex-col border-t border-white/5">
              {filteredTracks.map((track, i) => {
                const isCurrentTrack = currentTrack?.id === track.id;
                const isPlayingThis = isCurrentTrack && isPlaying;

                return (
                  <motion.div
                    key={track.id}
                    initial={reduce ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.04 }}
                    className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-white/5 group hover:bg-white/[0.01] px-4 transition-all relative"
                  >
                    <div className="flex items-start gap-4 flex-1 pr-6">
                      {/* Play wave indicator or index */}
                      <div className="pt-1.5 min-w-[24px]">
                        {isPlayingThis ? (
                          <div className="flex items-end gap-[2px] h-3.5 w-4">
                            <span className="w-[2px] h-2 bg-white waveform-bar" style={{ animationDelay: "0.1s" }} />
                            <span className="w-[2px] h-3.5 bg-white waveform-bar" style={{ animationDelay: "0.3s" }} />
                            <span className="w-[2px] h-1.5 bg-white waveform-bar" style={{ animationDelay: "0.5s" }} />
                          </div>
                        ) : (
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {(i + 1).toString().padStart(2, "0")}
                          </span>
                        )}
                      </div>

                      {/* Track details */}
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-lg font-bold text-white tracking-widest uppercase">
                            {track.title}
                          </h3>
                          <span className="font-display text-[9px] uppercase tracking-widest border border-white/10 px-2 py-0.5 text-muted-foreground">
                            {track.category}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-muted-foreground mt-2 leading-relaxed font-light max-w-3xl">
                          {track.description}
                        </p>
                      </div>
                    </div>

                    {/* Actions: Duration, Add to Playlist, Play */}
                    <div className="flex items-center justify-between md:justify-end gap-5 mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/5 md:border-t-0">
                      <span className="font-mono text-xs text-muted-foreground">{track.duration}</span>

                      {/* Add to Playlist button */}
                      <div className="relative">
                        <button
                          onClick={() => {
                            if (!isAuthenticated) {
                              toast.info("Please log in to customize playlists.");
                              setShowAuthModal(true);
                              return;
                            }
                            setActiveAddMenu(activeAddMenu === track.id ? null : track.id);
                          }}
                          className="p-2 border border-white/5 hover:border-white/20 bg-neutral-950 text-muted-foreground hover:text-white transition-colors"
                          title="Add to Playlist"
                        >
                          <ListPlus size={16} />
                        </button>

                        {/* Add to Playlist Dropdown */}
                        {activeAddMenu === track.id && (
                          <div className="absolute right-0 bottom-12 z-20 w-56 bg-neutral-950 border border-white/10 p-3 shadow-2xl animate-in slide-in-from-bottom-2 duration-150">
                            <p className="font-display text-[9px] uppercase tracking-widest text-muted-foreground border-b border-white/5 pb-1.5 mb-2">
                              Select Playlist
                            </p>
                            <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
                              {playlists.map((pl) => {
                                const hasTrack = pl.trackIds.includes(track.id);
                                return (
                                  <button
                                    key={pl.id}
                                    onClick={() => handleToggleTrackInPlaylist(pl.id, track.id)}
                                    className="flex items-center justify-between p-1.5 hover:bg-white/5 text-left text-xs text-neutral-300 hover:text-white uppercase tracking-wider"
                                  >
                                    <span className="truncate">{pl.name}</span>
                                    <span className="text-[10px] font-mono text-muted-foreground">
                                      {hasTrack ? "✔ REMOVE" : "➕ ADD"}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Play button */}
                      <button
                        onClick={() => playTrack(track.id)}
                        className="flex items-center gap-2 border border-white/10 px-4 py-2 font-display text-[10px] uppercase tracking-wider text-white hover:bg-white hover:text-black hover:border-white transition-all active:scale-95"
                      >
                        {isPlayingThis ? (
                          <>
                            <Pause size={12} weight="fill" />
                            PAUSE
                          </>
                        ) : (
                          <>
                            <Play size={12} weight="fill" />
                            PLAY
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="py-24 text-center border border-dashed border-white/10 bg-white/[0.01]">
              <MusicNotes size={32} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-display text-sm uppercase tracking-widest text-white">No compositions found</h3>
              <p className="font-sans text-xs text-muted-foreground mt-2">
                Try adjusting your search query or choosing another category.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PLAYLISTS */}
      {activeTab === "playlists" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Left panel: My Playlists list & Create form */}
          <div className="lg:col-span-5 space-y-8">
            <div className="border border-white/5 bg-white/[0.01] p-6">
              <h2 className="font-display text-sm uppercase tracking-[0.2em] text-white mb-6 flex items-center gap-2">
                <MusicNotes size={16} />
                My Playlists
              </h2>

              <div className="space-y-3">
                {playlists.map((pl) => {
                  const isSelected = selectedPlaylistId === pl.id;
                  return (
                    <div 
                      key={pl.id}
                      className={`flex items-center justify-between p-3 border transition-all ${
                        isSelected 
                          ? "bg-white/5 border-white" 
                          : "bg-transparent border-white/5 hover:border-white/20"
                      }`}
                    >
                      <button
                        onClick={() => setSelectedPlaylistId(pl.id)}
                        className="flex-1 text-left"
                      >
                        <h3 className="font-display text-xs uppercase tracking-wider text-white truncate">
                          {pl.name}
                        </h3>
                        <p className="font-sans text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                          {pl.trackIds.length} Compositions
                        </p>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePlayPlaylist(pl)}
                          className="p-1.5 hover:bg-white/10 text-white"
                          title="Play Playlist"
                        >
                          <Play size={14} weight="fill" />
                        </button>
                        {pl.id !== "default-masterpieces" && (
                          <button
                            onClick={() => handleDeletePlaylist(pl.id, pl.name)}
                            className="p-1.5 hover:bg-white/10 text-red-400 hover:text-red-500"
                            title="Delete Playlist"
                          >
                            <Trash size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Create Playlist Form (Prompts login if guest) */}
            <div className="border border-white/5 bg-white/[0.01] p-6 relative overflow-hidden">
              {!isAuthenticated && (
                <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
                  <LockSimple size={28} className="text-muted-foreground mb-3" />
                  <h3 className="font-display text-xs uppercase tracking-widest text-white">Guest Access Locked</h3>
                  <p className="font-sans text-[11px] text-muted-foreground mt-2 max-w-xs leading-relaxed">
                    Create custom compilations, save favorite symphonies, and sync queue lists across sessions.
                  </p>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="mt-4 px-4 py-2 border border-white text-white font-display text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                  >
                    LOGIN TO SAVE
                  </button>
                </div>
              )}

              <h2 className="font-display text-sm uppercase tracking-[0.2em] text-white mb-6">
                Create Playlist
              </h2>

              <form onSubmit={handleCreatePlaylist} className="space-y-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-muted-foreground mb-1.5">
                    Playlist Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="e.g. Midnight Symphonies"
                    className="w-full bg-neutral-900 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-white/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-muted-foreground mb-1.5">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newPlaylistDesc}
                    onChange={(e) => setNewPlaylistDesc(e.target.value)}
                    placeholder="Cinematic mood description"
                    rows={2}
                    className="w-full bg-neutral-900 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-white/30 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-white text-black font-display text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                >
                  CREATE NEW PLAYLIST
                </button>
              </form>
            </div>
          </div>

          {/* Right panel: Active playlist details & tracks */}
          <div className="lg:col-span-7">
            {selectedPlaylist ? (
              <div className="border border-white/10 bg-neutral-950/60 p-6 md:p-8 space-y-8">
                {/* Playlist details header */}
                <div className="border-b border-white/5 pb-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div>
                    <span className="font-display text-[9px] uppercase tracking-widest text-muted-foreground">Custom Compilation</span>
                    <h2 className="text-2xl font-bold text-white tracking-widest uppercase mt-1">
                      {selectedPlaylist.name}
                    </h2>
                    <p className="font-sans text-xs text-muted-foreground mt-2 font-light leading-relaxed">
                      {selectedPlaylist.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handlePlayPlaylist(selectedPlaylist)}
                    className="flex items-center gap-2 border border-white px-5 py-3 bg-white text-black font-display text-xs uppercase tracking-widest transition-all hover:bg-neutral-200 self-start"
                  >
                    <Play size={12} weight="fill" />
                    PLAY PLAYLIST
                  </button>
                </div>

                {/* Playlist tracks list */}
                <div className="space-y-4">
                  {playlistTracks.length > 0 ? (
                    playlistTracks.map((track, i) => {
                      const isCurrentTrack = currentTrack?.id === track.id;
                      const isPlayingThis = isCurrentTrack && isPlaying;
                      const isBeingDragged = draggedIndex === i;
                      const isDragOver = dragOverIndex === i;

                      return (
                        <div 
                          key={track.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, i)}
                          onDragOver={(e) => handleDragOver(e, i)}
                          onDragEnd={handleDragEnd}
                          onDrop={(e) => handleDrop(e, i)}
                          className={`flex items-center justify-between p-3 border cursor-grab active:cursor-grabbing transition-all ${
                            isBeingDragged ? "opacity-30 border-white/10 bg-neutral-900" : ""
                          } ${
                            isDragOver ? "border-white bg-white/5 scale-[1.02]" : "border-white/5 bg-white/[0.005] hover:bg-white/[0.01]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground/60 cursor-grab hover:text-white transition-colors">
                              <DotsSix size={16} />
                            </span>
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {(i + 1).toString().padStart(2, "0")}
                            </span>
                            <div>
                              <h4 className="font-display text-xs uppercase tracking-wider text-white">
                                {track.title}
                              </h4>
                              <p className="font-sans text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
                                {track.category}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-mono text-xs text-muted-foreground">{track.duration}</span>
                            <button
                              onClick={() => playTrack(track.id)}
                              className="size-8 border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all"
                            >
                              {isPlayingThis ? <Pause size={12} weight="fill" /> : <Play size={12} weight="fill" />}
                            </button>
                            <button
                              onClick={() => handleToggleTrackInPlaylist(selectedPlaylist.id, track.id)}
                              className="p-1 hover:bg-white/10 text-red-400"
                              title="Remove from Playlist"
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-12 text-center text-muted-foreground">
                      <p className="font-sans text-xs">This playlist is empty.</p>
                      <p className="font-sans text-[10px] uppercase mt-1">Go to "Archive" tab and click the List icon to add compositions!</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-24 text-center border border-dashed border-white/10">
                <p className="font-sans text-xs text-muted-foreground">Select a playlist to view tracks</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: STUDIO PLAYER (DEDICATED FULL MUSIC PLAYER UI) */}
      {activeTab === "player" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Left panel: Large interactive Vinyl / visualizer */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative border border-white/15 p-6 bg-neutral-950/40 w-full max-w-sm flex flex-col items-center">
              
              {/* Spinning record / vinyl */}
              <div className="relative aspect-square w-64 md:w-72 bg-black rounded-full shadow-2xl flex items-center justify-center border border-white/10 overflow-hidden">
                {/* Vinyl Grooves texture */}
                <div className="absolute inset-2 border border-white/[0.03] rounded-full" />
                <div className="absolute inset-6 border border-white/[0.04] rounded-full" />
                <div className="absolute inset-10 border border-white/[0.03] rounded-full" />
                <div className="absolute inset-14 border border-white/[0.05] rounded-full" />
                <div className="absolute inset-20 border border-white/[0.03] rounded-full" />
                
                {/* Spinning motion wrapper */}
                <motion.div
                  animate={isPlaying ? { rotate: 360 } : {}}
                  transition={isPlaying ? { repeat: Infinity, duration: 18, ease: "linear" } : {}}
                  className="w-full h-full absolute inset-0 flex items-center justify-center"
                >
                  {/* Album Cover inside vinyl */}
                  <div className="size-24 rounded-full overflow-hidden border-2 border-black relative z-10">
                    {currentTrack?.coverUrl ? (
                      <img 
                        src={currentTrack.coverUrl} 
                        alt="Current cover" 
                        className="w-full h-full object-cover grayscale"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                        <MusicNotes size={24} className="text-muted-foreground" />
                      </div>
                    )}
                    {/* Center Spindle Hole */}
                    <div className="absolute inset-0 m-auto size-5 bg-black rounded-full border-2 border-white/20 z-20" />
                  </div>
                </motion.div>
              </div>

              {/* Real-time high fidelity audio visualizer bars */}
              <div className="flex items-end justify-center gap-1.5 h-16 w-full mt-10">
                {Array.from({ length: 20 }).map((_, i) => (
                  <span 
                    key={i} 
                    className={`w-[4px] bg-white rounded-t-full ${isPlaying ? "waveform-bar" : "h-1 bg-white/10"}`} 
                    style={{ 
                      height: isPlaying ? `${Math.floor(Math.random() * 50) + 10}px` : "4px",
                      animationDelay: `${i * 0.08}s`,
                      animationDuration: `${0.8 + Math.random() * 0.6}s`
                    }} 
                  />
                ))}
              </div>

              {/* Status lights */}
              <div className="flex items-center justify-between w-full border-t border-white/10 mt-6 pt-4 text-muted-foreground font-mono text-[9px] uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${isPlaying ? "bg-green-500 animate-pulse" : "bg-neutral-600"}`} />
                  {isPlaying ? "LIVE AUDIO" : "STANDBY"}
                </span>
                <span>T4MH COZY RACK</span>
              </div>
            </div>
          </div>

          {/* Right panel: Deck Controls, Queue, details */}
          <div className="lg:col-span-7 space-y-8">
            <div className="border border-white/10 bg-neutral-950 p-6 md:p-8 space-y-6">
              
              {/* Metadata */}
              <div className="border-b border-white/10 pb-6">
                <div className="flex items-center justify-between">
                  <span className="font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Now Playing</span>
                  <span className="font-mono text-xs text-muted-foreground uppercase">{currentTrack?.category || "T4MH ARCHIVE"}</span>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-widest uppercase mt-2">
                  {currentTrack?.title || "Archive Closed"}
                </h2>
                <p className="font-sans text-xs text-muted-foreground mt-3 font-light leading-relaxed">
                  {currentTrack?.description || "Select a track from the list to begin playing."}
                </p>
              </div>

              {/* Custom Commentary / Notes section */}
              {currentTrack && (
                <div className="bg-white/[0.01] p-4 border border-white/5 space-y-2">
                  <h4 className="font-display text-[9px] uppercase tracking-widest text-white flex items-center gap-1">
                    <Info size={12} />
                    Composer Notes
                  </h4>
                  <p className="font-sans text-[11px] text-muted-foreground leading-relaxed font-light italic">
                    "This composition was written to express the balance of tension and resolution. Recorded with real acoustic instruments, mixing orchestral woodwinds and vintage synth parameters to capture the absolute atmosphere of space."
                  </p>
                </div>
              )}

              {/* Progress Bar with Seeker */}
              <div className="space-y-2">
                <div 
                  className="relative h-1 bg-white/10 hover:h-1.5 transition-all cursor-pointer group"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percentage = (clickX / rect.width) * 100;
                    seekTo(percentage);
                  }}
                >
                  <div 
                    className="absolute top-0 left-0 h-full bg-white transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls Deck */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-white/5 pt-6">
                {/* Playback loops */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setIsShuffle(!isShuffle);
                      toast.success(isShuffle ? "Shuffle disabled." : "Shuffle enabled.");
                    }}
                    className={`p-2 transition-colors ${isShuffle ? "text-white" : "text-neutral-500 hover:text-neutral-300"}`}
                    title="Shuffle"
                  >
                    <Shuffle size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setIsRepeat(!isRepeat);
                      toast.success(isRepeat ? "Repeat disabled." : "Repeat enabled.");
                    }}
                    className={`p-2 transition-colors ${isRepeat ? "text-white" : "text-neutral-500 hover:text-neutral-300"}`}
                    title="Repeat"
                  >
                    <Repeat size={18} />
                  </button>
                </div>

                {/* Center player buttons */}
                <div className="flex items-center gap-6">
                  <button 
                    onClick={prevTrack}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    <Play size={18} className="rotate-180" weight="fill" />
                  </button>
                  <button
                    onClick={playPause}
                    className="size-14 rounded-full border border-white/20 hover:border-white text-white hover:text-black hover:bg-white flex items-center justify-center transition-all duration-300 active:scale-95"
                  >
                    {isPlaying ? <Pause size={20} weight="fill" /> : <Play size={20} weight="fill" className="translate-x-[1px]" />}
                  </button>
                  <button 
                    onClick={nextTrack}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    <Play size={18} weight="fill" />
                  </button>
                </div>

                {/* Volume bar */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={toggleMute}
                    className="text-neutral-400 hover:text-white p-1"
                  >
                    {isMuted || volume === 0 ? <SpeakerX size={18} /> : <SpeakerHigh size={18} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-24 h-1 appearance-none bg-white/10 cursor-pointer accent-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-2.5 [&::-webkit-slider-thumb]:bg-white"
                  />
                </div>
              </div>

            </div>

            {/* Queue lists */}
            <div className="border border-white/10 bg-neutral-950 p-6">
              <h3 className="font-display text-[10px] uppercase tracking-widest text-muted-foreground border-b border-white/5 pb-2 mb-4">
                Play Queue (All Archive Compositions)
              </h3>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                {playlist.map((track) => {
                  const isCurrent = currentTrack?.id === track.id;
                  return (
                    <button
                      key={track.id}
                      onClick={() => playTrack(track.id)}
                      className={`flex items-center justify-between p-2 hover:bg-white/5 text-left text-xs uppercase tracking-wider transition-colors ${
                        isCurrent ? "bg-white/5 border-l border-white text-white" : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      <span className="truncate pr-4">{track.title}</span>
                      <span className="font-mono text-[10px] text-muted-foreground flex-shrink-0">{track.duration}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Music;
