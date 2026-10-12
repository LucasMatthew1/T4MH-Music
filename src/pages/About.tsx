import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const About = () => {
  const reduce = useReducedMotion();

  const values = [
    {
      title: "Human Emotion First",
      desc: "Music should capture genuine, raw feelings—tension, grief, wonder, and passion. We compose to connect on an intuitive, human level rather than following structured commercial algorithms."
    },
    {
      title: "Complete Artistic Freedom",
      desc: "Autonomy is the lifeblood of Keith’s studio. No executive feedback, no marketing targets, and no target demographic compromises. Sound is created strictly in service of the artistic vision."
    },
    {
      title: "Cross-Genre Fluidity",
      desc: "We refuse to lock compositions into narrow industry classifications. Orchestral, rock, acoustic, jazz, and vocal arrangements coexist and blend, reflecting the limitless nature of Keith’s multi-instrumental practice."
    },
    {
      title: "Authentic Expression",
      desc: "Every note played, every string voiced, and every electronic element synthesized is executed live and with careful intent. T4MH compositions are real, acoustic, human musical statements."
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-20 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-8 mb-16">
        <span className="font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground">The Philosophy</span>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-widest uppercase mt-2">
          About T4MH
        </h1>
      </div>

      {/* Philosophy Pull-Quote Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
        
        {/* Left Big Typographic Section */}
        <div className="lg:col-span-5">
          <span className="font-display text-4xl text-white/10 select-none block mb-4">𝄢</span>
          <blockquote className="font-display text-2xl md:text-3xl font-light tracking-wider text-white leading-relaxed italic border-l-2 border-white/20 pl-6">
            "Music is not simply something to consume. It is something to feel."
          </blockquote>
          <p className="font-sans text-sm text-muted-foreground mt-8 leading-relaxed font-light">
            T4MH Music is an independent musical platform founded by Keith. It stands as a silent rebellion against the mass-produced, algorithmically optimized tracks that dominate the modern sonic landscape.
          </p>
        </div>

        {/* Right Descriptive Column */}
        <div className="lg:col-span-7 font-sans text-sm md:text-base text-muted-foreground leading-relaxed font-light flex flex-col gap-6 lg:pl-6">
          <p>
            The studio was built on a simple, uncompromising premise: that music has a sacred duty to convey truth, narrative, and human feeling. By avoiding commercial constraints, T4MH allows Keith to explore sound without worrying about streaming analytics, playlist criteria, or immediate financial returns.
          </p>
          <p>
            Here, compositions are allowed to take their time. A track might build slowly over seven minutes, utilizing classical orchestrations alongside heavy electric guitars, or it might capture a single, raw piano take in the dead of night. This independence ensures that every piece in the archive represents an honest, unvarnished creative impulse.
          </p>
        </div>

      </div>

      {/* Editorial Cello Shadow Banner */}
      <motion.div 
        initial={reduce ? false : { opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative border border-white/5 p-2 bg-neutral-950 mb-24 max-h-[450px] overflow-hidden group"
      >
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <img 
            src="/assets/cello-shadow.jpg" 
            alt="Cinematic cello in shadow" 
            className="w-full h-full object-cover filter grayscale sepia-[5%] contrast-110 group-hover:scale-102 transition-transform duration-[8000ms]"
          />
          <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black via-transparent to-black" />
          
          {/* Subtle overlay typography */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
            <span className="font-display text-[10px] uppercase tracking-[0.4em] text-white/50 mb-2">T4MH Acoustic Space</span>
            <h3 className="font-display text-xl md:text-3xl font-light text-white tracking-[0.2em] uppercase max-w-2xl leading-relaxed">
              Resonance & Atmosphere
            </h3>
          </div>
        </div>
      </motion.div>

      {/* Core Values Section */}
      <div className="border-t border-white/10 pt-16">
        <h2 className="font-display text-xs uppercase tracking-[0.25em] text-white mb-12 text-center">
          Our Foundation Pillars
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex gap-4 items-start"
            >
              {/* Number marker */}
              <span className="font-display text-sm text-white/25 font-light pt-0.5 select-none">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                  {v.title}
                </h3>
                <p className="font-sans text-xs text-muted-foreground mt-3 leading-relaxed font-light">
                  {v.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default About;
