import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const Composer = () => {
  const reduce = useReducedMotion();

  // POETIC STATEMENT ABOUT KEITH
  const paragraphs = [
    "Keith is a lifelong multi-instrumentalist, composer, and musical storyteller whose relationship with sound began in early childhood. Guided by an innate curiosity, he learned to speak through instruments before ever analyzing the structures behind them. This foundational, raw connection remains the driving force of his creative practice.",
    "Over decades, Keith has cultivated a multi-instrumental background that allows him to write, perform, and record original compositions entirely on his own terms. His creative process is fluid, moving between the classical precision of symphonic arrangements, the visceral energy of experimental rock, the intimate spaces of jazz improvisation, and the sweeping arcs of cinematic film soundtracks.",
    "For Keith, composition is not a commercial enterprise or a pursuit of industry credentials. It is a vital medium for authentic expression—a way to capture pure human emotion, tension, and narrative without the boundaries or compromises of the commercial music industry.",
    "Every piece in the T4MH Music catalog is created, produced, and mastered in Keith's private studio. The result is a highly personal, deeply atmospheric archive of original music that invites listeners to feel, reflect, and discover stories told entirely through sound."
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-20 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-8 mb-16">
        <span className="font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground">The Creator</span>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-widest uppercase mt-2">
          The Composer
        </h1>
      </div>

      {/* Editorial Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Image with fine frame */}
        <motion.div 
          initial={reduce ? false : { opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5"
        >
          <div className="relative border border-white/10 p-2 bg-neutral-950">
            <div className="relative aspect-[3/4] overflow-hidden">
              <img 
                src="/assets/composer.jpg" 
                alt="Keith - Composer and Multi-instrumentalist" 
                className="h-full w-full object-cover filter grayscale sepia-[15%] contrast-[110%] hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-black/10 mix-blend-color" />
            </div>
            
            {/* Fine watermark/signature style element */}
            <div className="mt-4 flex items-center justify-between px-2 text-muted-foreground font-mono text-[9px] uppercase tracking-widest">
              <span>KEITH — MULTI-INSTRUMENTALIST</span>
              <span>EST. T4MH</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Poetic Narrative */}
        <motion.div 
          initial={reduce ? false : { opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="lg:col-span-7 flex flex-col gap-8 lg:pl-4"
        >
          {/* Main Pull Quote */}
          <div className="border-l-2 border-white/20 pl-6 py-1">
            <p className="font-display text-xl md:text-2xl text-white tracking-wider leading-relaxed font-light">
              "Music is the language of the unspoken. I compose to give form to the emotions that exist beyond words."
            </p>
          </div>

          {/* Biographical Paragraphs */}
          <div className="flex flex-col gap-6 text-sm md:text-base text-muted-foreground font-light leading-relaxed">
            {paragraphs.map((p, index) => (
              <p key={index}>{p}</p>
            ))}
          </div>

          {/* Core Values List */}
          <div className="mt-8 border-t border-white/5 pt-8">
            <h3 className="font-display text-xs uppercase tracking-[0.25em] text-white mb-6">
              Creative Tenets
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-display text-xs text-white uppercase tracking-wider">01. Emotional Storytelling</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  Compositions that follow dramatic arcs, creating deep sonic atmosphere and narrative journeys.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-xs text-white uppercase tracking-wider">02. Cross-Genre Freedom</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  Dissolving the boundaries between symphonic orchestrations, heavy rock, and solo acoustic pieces.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-xs text-white uppercase tracking-wider">03. Lifelong Autonomy</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  Performing, recording, and producing every voice, chord, and beat completely independently.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-xs text-white uppercase tracking-wider">04. No Commercial Constraints</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  Creating purely for the art itself, respecting the listener's intelligence and emotional capacity.
                </p>
              </div>
            </div>
          </div>

        </motion.div>

      </div>

      {/* Studio Footage Section */}
      <motion.div 
        initial={reduce ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8 }}
        className="mt-24 border-t border-white/10 pt-16"
      >
        <span className="font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground block mb-3 text-center">Studio Session Footage</span>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-widest uppercase text-center mb-10">
          Rehearsal & Performance
        </h2>
        
        <div className="relative border border-white/10 p-2 bg-neutral-950 max-w-4xl mx-auto overflow-hidden group">
          <div className="relative aspect-video overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-65 group-hover:scale-[1.02] transition-transform duration-[8000ms] ease-out"
            >
              <source src="/assets/piano-playing.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />
            
            {/* Visual indicators overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white font-mono text-[10px] tracking-widest z-10">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                REC LIVE 4K
              </span>
              <span>STUDIO SESSION — KEYBOARDS</span>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default Composer;
