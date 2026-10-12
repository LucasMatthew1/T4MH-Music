import React from "react";
import { Link } from "react-router-dom";
import { useAudio } from "@/context/AudioContext";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Pause, MusicNotes, ArrowRight, ArrowUpRight } from "@phosphor-icons/react";

const Index = () => {
  const { currentTrack, isPlaying, playTrack, playPause } = useAudio();
  const reduce = useReducedMotion();

  // Highlight tracks
  const featuredTracks = [
    {
      id: "book-of-spells",
      title: "Book of Spells",
      category: "Symphonic / Cinematic",
      description: "An evocative, orchestration-driven journey through mystery and ancient lore. Whispering piano motifs build into a powerful, sweeping string climax.",
      duration: "6:12",
      coverUrl: "/assets/piano-sheet.jpg"
    },
    {
      id: "haunted",
      title: "Haunted",
      category: "Instrumental / Rock",
      description: "A dark, atmospheric rock composition combining ambient electric guitar soundscapes with a heavy, driving rhythmic heartbeat.",
      duration: "7:05",
      coverUrl: "/assets/piano-notes.jpg"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <div className="relative w-full">
      
      {/* SECTION 1: HERO */}
      <section className="relative flex min-h-[95dvh] flex-col items-center justify-center px-6 text-center overflow-hidden border-b border-white/5">
        
        {/* Background Video Loop */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-25 transition-all duration-[10000ms] ease-out"
          >
            <source src="/assets/orchestra-bg.mp4" type="video/mp4" />
          </video>
          {/* Subtle gradient scrim overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/80 to-black" />
        </div>

        {/* Ambient background glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-10" aria-hidden="true">
          <div className="h-[400px] w-[600px] rounded-full bg-white/[0.03] blur-[120px]" />
        </div>

        {/* Hero Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-5xl flex flex-col items-center"
        >
          {/* Subtle Treble Clef Emblem */}
          <motion.div 
            variants={itemVariants}
            className="mb-8 flex items-center justify-center"
          >
            <span className="font-display text-4xl text-white/40 select-none tracking-widest font-light">
              𝄞
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            variants={itemVariants}
            className="text-[clamp(2.5rem,6vw,6.5rem)] font-extrabold text-white tracking-[0.3em] uppercase leading-none select-none"
          >
            T4MH MUSIC
          </motion.h1>

          {/* Supporting statement */}
          <motion.p 
            variants={itemVariants}
            className="mt-6 font-display text-sm md:text-lg uppercase tracking-[0.4em] text-white/90 max-w-3xl"
          >
            Original music. Human emotion. No boundaries.
          </motion.p>

          {/* Divider */}
          <motion.div 
            variants={itemVariants}
            className="w-24 h-[1px] bg-white/20 my-8"
          />

          {/* Introduction */}
          <motion.p 
            variants={itemVariants}
            className="text-sm md:text-base leading-relaxed text-muted-foreground max-w-2xl font-light"
          >
            An independent musical platform dedicated to original composition, emotional expression, and music that exists beyond commercial constraints. Founded by lifelong multi-instrumentalist Keith.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            variants={itemVariants}
            className="mt-12 flex flex-col sm:flex-row items-center gap-6"
          >
            <button
              onClick={() => playTrack("book-of-spells")}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-display text-xs uppercase tracking-[0.25em] transition-all hover:bg-neutral-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Play size={14} weight="fill" />
              ENTER THE MUSIC
            </button>
            <Link
              to="/composer"
              className="w-full sm:w-auto px-8 py-4 border border-white/10 hover:border-white/30 text-white font-display text-xs uppercase tracking-[0.25em] transition-all hover:bg-white/5 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              MEET THE COMPOSER
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Slow drifting notation fragments */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <span className="absolute top-[25%] left-[10%] text-white/[0.03] text-[6rem] font-serif">𝄢</span>
          <span className="absolute bottom-[30%] right-[12%] text-white/[0.03] text-[7rem] font-serif">𝄡</span>
          <span className="absolute top-[15%] right-[20%] text-white/[0.02] text-[4rem] font-serif">𝄾</span>
          <span className="absolute bottom-[15%] left-[25%] text-white/[0.02] text-[5rem] font-serif">𝄿</span>
        </div>
      </section>

      {/* SECTION 2: FEATURED COMPOSITIONS */}
      <section className="relative py-24 md:py-32 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          
          {/* Section title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 mb-16">
            <div>
              <span className="font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Featured Work</span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-widest uppercase mt-2">
                Flagship Compositions
              </h2>
            </div>
            <Link 
              to="/music" 
              className="flex items-center gap-2 font-display text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors mt-4 md:mt-0 group"
            >
              VIEW COMPOSITIONS ARCHIVE
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Featured Tracks Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
            {featuredTracks.map((track, i) => {
              const isCurrentTrack = currentTrack?.id === track.id;
              const isPlayingThis = isCurrentTrack && isPlaying;

              return (
                <motion.div
                  key={track.id}
                  initial={reduce ? false : { opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, delay: i * 0.15 }}
                  className="flex flex-col md:flex-row gap-6 md:gap-8 items-start group border border-white/[0.03] p-6 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02] transition-all duration-500"
                >
                  {/* Track Artwork */}
                  <div className="relative size-40 md:size-48 flex-shrink-0 bg-neutral-900 overflow-hidden border border-white/10">
                    <img 
                      src={track.coverUrl} 
                      alt={track.title} 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => playTrack(track.id)}
                        className="size-12 rounded-full bg-white text-black flex items-center justify-center transition-transform transform hover:scale-105"
                        aria-label={`Play ${track.title}`}
                      >
                        {isPlayingThis ? <Pause size={20} weight="fill" /> : <Play size={20} weight="fill" className="translate-x-[1px]" />}
                      </button>
                    </div>
                  </div>

                  {/* Track Info */}
                  <div className="flex flex-col h-full justify-between flex-1 py-1">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-display text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                          {track.category}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">{track.duration}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase mt-2 group-hover:text-white/90 transition-colors">
                        {track.title}
                      </h3>
                      <p className="font-sans text-sm text-muted-foreground leading-relaxed font-light mt-3">
                        {track.description}
                      </p>
                    </div>

                    {/* Progress visualizer */}
                    <div className="mt-6 flex items-center gap-4">
                      <button
                        onClick={() => playTrack(track.id)}
                        className="flex items-center gap-2 border border-white/10 px-4 py-2 font-display text-[10px] uppercase tracking-wider text-white hover:bg-white hover:text-black hover:border-white transition-all active:scale-95"
                      >
                        {isPlayingThis ? "PAUSE" : "LISTEN TRACK"}
                      </button>

                      {/* Animated wave bars if playing this track */}
                      {isPlayingThis ? (
                        <div className="flex items-end gap-1 h-6 px-2">
                          <span className="w-1 h-3 bg-white waveform-bar" style={{ animationDelay: "0.1s" }} />
                          <span className="w-1 h-5 bg-white waveform-bar" style={{ animationDelay: "0.4s" }} />
                          <span className="w-1 h-2 bg-white waveform-bar" style={{ animationDelay: "0.2s" }} />
                          <span className="w-1 h-4 bg-white waveform-bar" style={{ animationDelay: "0.5s" }} />
                          <span className="w-1 h-3 bg-white waveform-bar" style={{ animationDelay: "0.3s" }} />
                        </div>
                      ) : (
                        <div className="flex items-end gap-1 h-6 px-2 opacity-30">
                          <span className="w-1 h-1 bg-white" />
                          <span className="w-1 h-1 bg-white" />
                          <span className="w-1 h-1 bg-white" />
                          <span className="w-1 h-1 bg-white" />
                          <span className="w-1 h-1 bg-white" />
                        </div>
                      )}
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 3: STATEMENT / PHILOSOPHY PULL-QUOTE */}
      <section className="relative py-28 md:py-36 bg-neutral-950/40 border-b border-white/5">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            <span className="font-display text-3xl text-white/10 select-none tracking-widest block mb-4">𝄟</span>
            <blockquote className="font-display text-2xl md:text-4xl text-white leading-relaxed tracking-wider font-light italic max-w-4xl text-balance">
              "Music is not simply something to consume. It is something to feel."
            </blockquote>
            <cite className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mt-8 block not-italic">
              — The T4MH Composition Philosophy
            </cite>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Index;
