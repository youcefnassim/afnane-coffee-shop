"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Coffee, Users, Award, Heart, Sparkles } from "lucide-react";
import { AnimationWrapper, StaggerContainer, StaggerItem } from "@/components/shared/AnimationWrapper";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

const stats = [
  { icon: Coffee, value: 50, suffix: "+", key: "statRecipes" as const },
  { icon: Users, value: 12000, suffix: "+", key: "statCustomers" as const },
  { icon: Award, value: 100, suffix: "%", key: "statFresh" as const },
  { icon: Heart, value: 5, suffix: "", key: "statPassion" as const },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function AboutSection() {
  const { language } = useLanguageStore();
  const t = translations[language] || translations.fr;

  return (
    <section
      id="about"
      className="py-24 md:py-32 bg-background dark:bg-background-dark relative overflow-hidden"
    >
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/[0.03] rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/[0.04] rounded-full blur-3xl" />

      <div className="container-premium max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <AnimationWrapper type="fade" direction="up">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-secondary text-xs font-semibold uppercase tracking-[0.25em] mb-3 block flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-secondary" /> {t.about.badge}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white uppercase tracking-wider mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              {t.about.heading}
            </h2>
            <div className="w-16 h-1 bg-secondary mx-auto mb-6 rounded-full" />
            <p className="text-muted dark:text-muted-dark text-base md:text-lg leading-relaxed">
              {t.about.subheading}
            </p>
          </div>
        </AnimationWrapper>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Text Content */}
          <AnimationWrapper type="slide" direction="left" delay={0.1}>
            <div className="space-y-8">
              <div>
                <h3
                  className="text-2xl font-bold text-dark dark:text-white mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {t.about.artTitle}
                </h3>
                <p className="text-muted dark:text-muted-dark leading-relaxed text-sm md:text-base">
                  {t.about.artDesc}
                </p>
              </div>

              {/* Mission */}
              <div className={cn(
                "p-4 rounded-2xl bg-primary/5 dark:bg-white/5",
                language === "ar" ? "pr-6 border-r-3 border-secondary" : "pl-6 border-l-3 border-secondary"
              )}>
                <h4 className="text-base font-bold text-primary dark:text-secondary mb-1">
                  {t.about.missionTitle}
                </h4>
                <p className="text-muted dark:text-muted-dark text-xs md:text-sm leading-relaxed">
                  {t.about.missionDesc}
                </p>
              </div>

              {/* Commitment */}
              <div className={cn(
                "p-4 rounded-2xl bg-primary/5 dark:bg-white/5",
                language === "ar" ? "pr-6 border-r-3 border-secondary" : "pl-6 border-l-3 border-secondary"
              )}>
                <h4 className="text-base font-bold text-primary dark:text-secondary mb-1">
                  {t.about.commitmentTitle}
                </h4>
                <p className="text-muted dark:text-muted-dark text-xs md:text-sm leading-relaxed">
                  {t.about.commitmentDesc}
                </p>
              </div>
            </div>
          </AnimationWrapper>

          {/* Image Grid with Real Photos */}
          <AnimationWrapper type="slide" direction="right" delay={0.2}>
            <div className="relative aspect-video w-full rounded-[32px] overflow-hidden shadow-2xl border-4 border-secondary/40 bg-black group">
              <video
                src="/Video.mp4"
                autoPlay
                muted
                loop
                playsInline
                controls
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          </AnimationWrapper>
        </div>

        {/* Stats */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6" staggerDelay={0.1}>
          {stats.map((stat) => (
            <StaggerItem key={stat.key}>
              <div className="text-center bg-card dark:bg-card-dark p-6 rounded-3xl border border-border/40 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                  <stat.icon className="w-6 h-6 text-primary dark:text-secondary" />
                </div>
                <div
                  className="text-3xl md:text-4xl font-bold text-primary dark:text-secondary mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.key === "statPassion" ? ` ${t.about.years}` : stat.suffix}
                  />
                </div>
                <p className="text-muted dark:text-muted-dark text-xs font-semibold uppercase tracking-wider">
                  {t.about[stat.key]}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
