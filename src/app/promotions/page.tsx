"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tag, Clock, Percent, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimationWrapper, StaggerContainer, StaggerItem } from "@/components/shared/AnimationWrapper";
import { formatPrice, getTimeRemaining } from "@/lib/utils";

const DEMO_PROMOTIONS = [
  {
    id: "1",
    title: "Summer Iced Drinks",
    description: "Enjoy 30% off on all iced drinks this summer. Stay cool with our refreshing beverages!",
    discount: 30,
    product_name: "All Iced Drinks",
    original_price: 500,
    end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    color: "from-blue-500/20 to-cyan-400/10",
    icon: "🧊",
  },
  {
    id: "2",
    title: "Burger Combo Deal",
    description: "Get our Classic Burger with fries and a drink at a special price. Limited time offer!",
    discount: 25,
    product_name: "Burger Combo",
    original_price: 1200,
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    color: "from-orange-500/20 to-red-400/10",
    icon: "🍔",
  },
  {
    id: "3",
    title: "Morning Coffee Special",
    description: "Start your day right! Any coffee before 10 AM at 20% off. Because mornings deserve better coffee.",
    discount: 20,
    product_name: "All Coffee (before 10 AM)",
    original_price: 350,
    end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    color: "from-amber-500/20 to-yellow-400/10",
    icon: "☕",
  },
  {
    id: "4",
    title: "Dessert Week",
    description: "Treat yourself! All desserts at 15% off this week. Perfect for your sweet tooth.",
    discount: 15,
    product_name: "All Desserts",
    original_price: 600,
    end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    color: "from-pink-500/20 to-rose-400/10",
    icon: "🍰",
  },
];

function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(endDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(endDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (timeLeft.total <= 0) {
    return (
      <span className="text-danger text-sm font-semibold">Expired</span>
    );
  }

  const units = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hrs" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ];

  return (
    <div className="flex gap-2">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="flex flex-col items-center min-w-[48px] py-2 px-1.5 rounded-xl bg-dark/5 dark:bg-white/5"
        >
          <span className="text-lg font-bold text-dark dark:text-white tabular-nums leading-none">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-muted dark:text-muted-dark uppercase tracking-wider mt-0.5">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PromotionsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-background dark:bg-background-dark">
        <div className="container-premium">
          {/* Header */}
          <AnimationWrapper type="fade" direction="up">
            <div className="text-center mb-16">
              <span className="text-secondary text-sm font-semibold uppercase tracking-[0.25em] mb-3 block">
                Special Offers
              </span>
              <h1 className="section-heading">Current Promotions</h1>
              <span className="heading-accent" />
              <p className="section-subheading mt-6">
                Don&apos;t miss out on our limited-time offers. Great taste at even greater prices.
              </p>
            </div>
          </AnimationWrapper>

          {/* Promotions Grid */}
          <StaggerContainer
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
            staggerDelay={0.12}
          >
            {DEMO_PROMOTIONS.map((promo) => {
              const discountedPrice = Math.round(
                promo.original_price * (1 - promo.discount / 100)
              );

              return (
                <StaggerItem key={promo.id}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`relative bg-card dark:bg-card-dark rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-500`}
                  >
                    {/* Discount ribbon */}
                    <div className="absolute top-4 right-4 z-10">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-danger text-white text-sm font-bold shadow-lg">
                        <Percent className="w-3.5 h-3.5" />
                        -{promo.discount}%
                      </div>
                    </div>

                    {/* Top banner area */}
                    <div className={`h-44 bg-gradient-to-br ${promo.color} relative flex items-center justify-center`}>
                      <span className="text-6xl">{promo.icon}</span>
                      {/* Subtle pattern */}
                      <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: `radial-gradient(circle at 25% 50%, white 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                      }} />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-secondary" />
                        <span className="text-xs text-secondary font-semibold uppercase tracking-wider">
                          Limited Time
                        </span>
                      </div>

                      <h3
                        className="text-xl font-bold text-dark dark:text-white mb-2"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {promo.title}
                      </h3>

                      <p className="text-muted dark:text-muted-dark text-sm leading-relaxed mb-4">
                        {promo.description}
                      </p>

                      {/* Price */}
                      <div className="flex items-center gap-3 mb-5">
                        <span className="text-2xl font-bold text-primary dark:text-secondary">
                          {formatPrice(discountedPrice)}
                        </span>
                        <span className="text-base text-muted dark:text-muted-dark line-through">
                          {formatPrice(promo.original_price)}
                        </span>
                      </div>

                      {/* Countdown */}
                      <div className="pt-4 border-t border-border/50 dark:border-border-dark/50">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="w-3.5 h-3.5 text-muted dark:text-muted-dark" />
                          <span className="text-xs text-muted dark:text-muted-dark font-medium uppercase tracking-wider">
                            Ends in
                          </span>
                        </div>
                        <CountdownTimer endDate={promo.end_date} />
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </main>
      <Footer />
    </>
  );
}
