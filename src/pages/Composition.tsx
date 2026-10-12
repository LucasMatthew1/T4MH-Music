import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const Composition = () => {
  const reduce = useReducedMotion();

  const capabilities = [
    {
      num: "I",
      title: "Original Symphonic Compositions",
      desc: "Full-scale orchestral arrangements characterized by complex harmonic structures, sweeping string melodies, powerful percussion backdrops, and dramatic, emotional dynamic shifts. Designed for cinematic scale and deep immersion."
    },
    {
      num: "II",
      title: "Instrumental & Vocal Arrangements",
      desc: "Intimate and intricate compositions tailored for solo piano, chamber ensembles, vocal harmonies, or unique acoustic combinations. These pieces emphasize raw tone, subtle performance nuances, and absolute space."
    },
    {
      num: "III",
      title: "Film & TV Soundtracks",
      desc: "Custom sonic scoring aligned with visual narrative cues. Keith collaborates directly with independent directors to construct cohesive, bespoke musical universes that deepen the visual atmosphere and character subtext."
    },
    {
      num: "IV",
      title: "Atmospheric Cinematic Music",
      desc: "Slower, texturally dense soundscapes blending organic performance with synthetic elements. Perfect for setting moody, mysterious, or melancholic backdrops where music needs to breathe and sit under dialogue."
    },
    {
      num: "V",
      title: "Cross-Genre Original Music",
      desc: "Defying traditional genre boundaries. Fusing classical motifs with visceral rock riffs, jazz improvisational structures, or choral vocals, resulting in progressive, unpredictable musical journeys."
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-20 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-8 mb-16">
        <span className="font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground">The Practice</span>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-widest uppercase mt-2">
          Capabilities
        </h1>
        <p className="font-sans text-sm text-muted-foreground mt-4 max-w-2xl font-light leading-relaxed">
          The studio's original composition capabilities span orchestral scale, solo acoustic recordings, and progressive genre hybrids, tailored for artistic expression and film score collaboration.
        </p>
      </div>

      {/* Editorial Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left column: Artistic Philosophy */}
        <div className="lg:col-span-4 lg:sticky lg:top-28">
          <span className="font-display text-4xl text-white/10 select-none block mb-4">𝄠</span>
          <h2 className="font-display text-lg text-white uppercase tracking-widest">
            A Creative Practice
          </h2>
          <p className="font-sans text-sm text-muted-foreground mt-4 leading-relaxed font-light">
            Composition is not a service to buy—it is an artistic partnership. Every note is written, played, and recorded with direct attention to tone, timber, and the story being told.
          </p>
          <div className="mt-8 border-t border-white/5 pt-8">
            <p className="font-sans text-xs text-muted-foreground leading-relaxed font-light italic">
              "We begin with the feeling. The genre, the arrangement, and the instruments follow the emotional requirements of the story."
            </p>
          </div>
        </div>

        {/* Right column: Capability List */}
        <div className="lg:col-span-8 flex flex-col border-t border-white/10">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.num}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="grid grid-cols-1 md:grid-cols-12 py-8 border-b border-white/5 group hover:bg-white/[0.005] px-4 transition-colors gap-4"
            >
              {/* Roman numeral */}
              <div className="md:col-span-2">
                <span className="font-display text-lg text-white/30 group-hover:text-white/80 transition-colors font-light">
                  {cap.num}
                </span>
              </div>

              {/* Text content */}
              <div className="md:col-span-10">
                <h3 className="font-display text-base font-bold text-white uppercase tracking-wider group-hover:text-white/90 transition-colors">
                  {cap.title}
                </h3>
                <p className="font-sans text-sm text-muted-foreground mt-3 leading-relaxed font-light">
                  {cap.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default Composition;
