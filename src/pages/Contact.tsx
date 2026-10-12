import React, { useState } from "react";
import { toast } from "sonner";
import { EnvelopeSimple, PaperPlane, Info } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";

const Contact = () => {
  const reduce = useReducedMotion();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "General Inquiry",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message dispatched successfully.", {
        description: "Keith will receive your transmission within the day."
      });
      setFormData({
        name: "",
        email: "",
        inquiryType: "General Inquiry",
        message: ""
      });
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-20 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-8 mb-16">
        <span className="font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Inquiries</span>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-widest uppercase mt-2">
          Contact
        </h1>
        <p className="font-sans text-sm text-muted-foreground mt-4 max-w-2xl font-light leading-relaxed">
          For general inquiries, soundtrack commissions, independent collaborations, or licensing permissions, please dispatch a message using the secure portal below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Portal Information */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="border border-white/10 p-6 bg-neutral-950/40">
            <h3 className="font-display text-xs uppercase tracking-[0.25em] text-white mb-4">
              Transmission Notice
            </h3>
            <p className="font-sans text-xs text-muted-foreground leading-relaxed font-light">
              This communication channel is direct and private. Each submission is delivered directly to Keith's studio in-box without external filtering.
            </p>
            <div className="mt-6 flex items-center gap-3 text-white/40">
              <EnvelopeSimple size={16} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">DIRECT PORTAL CONNECTED</span>
            </div>
          </div>

          <div className="border border-white/5 p-6 bg-neutral-950/20">
            <h3 className="font-display text-xs uppercase tracking-[0.25em] text-white mb-4">
              COMMISSIONS & COLLABORATIONS
            </h3>
            <p className="font-sans text-xs text-muted-foreground leading-relaxed font-light">
              Keith is available for selective scoring of independent short films, theatrical projects, and creative multimedia installations. Commercial licenses are reviewed case-by-case to safeguard artistic integrity.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <motion.div 
          initial={reduce ? false : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="lg:col-span-7"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 border border-white/10 p-8 md:p-10 bg-neutral-950">
            
            <h2 className="font-display text-xs uppercase tracking-[0.25em] text-white border-b border-white/10 pb-4 mb-2">
              Dispatch Message
            </h2>

            {/* Name input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-display text-[10px] uppercase tracking-widest text-muted-foreground">
                Name <span className="text-white/40">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="w-full bg-transparent border-b border-white/15 py-2 font-sans text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-white transition-all rounded-none"
              />
            </div>

            {/* Email input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-display text-[10px] uppercase tracking-widest text-muted-foreground">
                Email Address <span className="text-white/40">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Your email address"
                className="w-full bg-transparent border-b border-white/15 py-2 font-sans text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-white transition-all rounded-none"
              />
            </div>

            {/* Inquiry Type Select */}
            <div className="flex flex-col gap-2">
              <label htmlFor="inquiryType" className="font-display text-[10px] uppercase tracking-widest text-muted-foreground">
                Inquiry Type
              </label>
              <div className="relative">
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  className="w-full bg-neutral-900 border border-white/10 px-3 py-2.5 font-sans text-xs text-white focus:outline-none focus:border-white/40 transition-all rounded-none appearance-none"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Collaboration Inquiries">Collaboration Inquiries</option>
                  <option value="Film/TV Soundtrack Inquiries">Film/TV Soundtrack Inquiries</option>
                  <option value="Artist Inquiries">Artist Inquiries</option>
                  <option value="Commercial Licensing Requests">Commercial Licensing Requests</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                  <span className="text-[10px]">▼</span>
                </div>
              </div>
            </div>

            {/* Message Textarea */}
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="font-display text-[10px] uppercase tracking-widest text-muted-foreground">
                Message <span className="text-white/40">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Your transmission details..."
                className="w-full bg-transparent border border-white/15 p-3 font-sans text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-white transition-all rounded-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-8 py-4 bg-white text-black font-display text-xs uppercase tracking-[0.25em] transition-all hover:bg-neutral-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  "DISPATCHING..."
                ) : (
                  <>
                    <PaperPlane size={14} weight="fill" />
                    DISPATCH TRANSMISSION
                  </>
                )}
              </button>
            </div>

          </form>
        </motion.div>

      </div>

    </div>
  );
};

export default Contact;
