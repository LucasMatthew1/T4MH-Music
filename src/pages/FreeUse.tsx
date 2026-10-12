import React from "react";
import { Link } from "react-router-dom";
import { Check, X, EnvelopeSimple, Key } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";

const FreeUse = () => {
  const reduce = useReducedMotion();

  const permitted = [
    "Non-commercial personal video scoring (YouTube, Vimeo, etc.)",
    "Student film scores & educational project soundtracks",
    "Independent podcast backing music (with no paid sponsorships)",
    "Non-profit theatrical plays, exhibitions, & art installations",
    "Personal listening, meditation, & non-monetized streaming"
  ];

  const prohibited = [
    "Commercial video games, apps, or software integrations",
    "Paid advertisements, promos, or brand marketing campaigns",
    "Reselling, sub-licensing, or redistributing files as audio packs",
    "Uploading tracks to digital streaming platforms (Spotify, Apple Music)",
    "Any project that directly generates revenue or monetization"
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-20 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-8 mb-16">
        <span className="font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Licensing Policy</span>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-widest uppercase mt-2">
          Free Use & Licensing
        </h1>
        <p className="font-sans text-sm text-muted-foreground mt-4 max-w-2xl font-light leading-relaxed">
          T4MH Music is built around pure artistic expression. To support other independent creators, Keith provides free non-commercial licensing options under clear guidelines.
        </p>
      </div>

      {/* Core Policy Statement */}
      <motion.div 
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border border-white/10 p-8 md:p-12 bg-neutral-950 text-center mb-16"
      >
        <span className="font-display text-4xl text-white/20 select-none block mb-6">𝄞</span>
        <h2 className="font-display text-xl md:text-2xl text-white uppercase tracking-widest max-w-3xl mx-auto leading-relaxed">
          "Original compositions may be used free of charge for non-commercial purposes."
        </h2>
        <div className="w-16 h-[1px] bg-white/10 mx-auto my-6" />
        <p className="font-sans text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
          No payment, royalties, or complex paperwork are required for any permitted non-commercial project. We simply ask that you credit <strong className="text-white font-medium">T4MH Music (Keith)</strong> in your project's credits or description.
        </p>
      </motion.div>

      {/* Permitted vs Prohibited Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
        
        {/* Permitted Column */}
        <div className="border border-white/5 p-6 md:p-8 bg-neutral-950/20">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
            <div className="size-6 rounded-full border border-white/20 flex items-center justify-center text-white">
              <Check size={14} />
            </div>
            <h3 className="font-display text-xs uppercase tracking-[0.25em] text-white">
              PERMITTED USES
            </h3>
          </div>
          
          <ul className="flex flex-col gap-4">
            {permitted.map((item, i) => (
              <li key={i} className="flex items-start gap-3.5">
                <span className="text-white/40 mt-0.5">•</span>
                <span className="font-sans text-xs text-muted-foreground leading-relaxed font-light">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prohibited Column */}
        <div className="border border-white/5 p-6 md:p-8 bg-neutral-950/20">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
            <div className="size-6 rounded-full border border-white/20 flex items-center justify-center text-white/40">
              <X size={14} />
            </div>
            <h3 className="font-display text-xs uppercase tracking-[0.25em] text-muted-foreground">
              NOT PERMITTED
            </h3>
          </div>
          
          <ul className="flex flex-col gap-4">
            {prohibited.map((item, i) => (
              <li key={i} className="flex items-start gap-3.5">
                <span className="text-white/20 mt-0.5">•</span>
                <span className="font-sans text-xs text-muted-foreground leading-relaxed font-light">{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Commercial License / Contact Call to Action */}
      <div className="border-t border-white/10 pt-12 text-center max-w-3xl mx-auto">
        <h3 className="font-display text-sm uppercase tracking-[0.3em] text-white">
          Commercial Usage & Licensing Queries
        </h3>
        <p className="font-sans text-xs text-muted-foreground mt-4 leading-relaxed font-light">
          If your project is commercial, monetized, or if you are unsure whether your use case falls under the non-commercial policy, please reach out. Keith provides bespoke commercial licensing rights and original scoring options.
        </p>
        <div className="mt-8">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2.5 border border-white/20 hover:border-white/50 px-8 py-3.5 font-display text-xs uppercase tracking-[0.25em] text-white transition-all hover:bg-white hover:text-black active:scale-[0.98]"
          >
            <EnvelopeSimple size={14} />
            Request Permission / Contact T4MH Music
          </Link>
        </div>
      </div>

    </div>
  );
};

export default FreeUse;
