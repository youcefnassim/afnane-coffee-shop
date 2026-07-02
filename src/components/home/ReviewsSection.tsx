"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { AnimationWrapper } from "@/components/shared/AnimationWrapper";
import { useRef, useEffect, useState } from "react";

const REVIEWS = [
  {
    id: "1",
    name: "Yasmine B.",
    rating: 5,
    comment: "The best coffee in town! The atmosphere is incredible and the staff is so friendly. I come here every morning.",
    date: "2 weeks ago",
  },
  {
    id: "2",
    name: "Karim M.",
    rating: 5,
    comment: "Their burgers are absolutely amazing. Fresh ingredients and generous portions. The tiramisu is a must-try!",
    date: "1 month ago",
  },
  {
    id: "3",
    name: "Sarah L.",
    rating: 4,
    comment: "Beautiful interior design and great food. The iced latte is my favorite. Highly recommended for families.",
    date: "3 weeks ago",
  },
  {
    id: "4",
    name: "Ahmed T.",
    rating: 5,
    comment: "A premium experience from start to finish. The attention to detail in both food and service is outstanding.",
    date: "1 week ago",
  },
  {
    id: "5",
    name: "Fatima Z.",
    rating: 5,
    comment: "I love their desserts! Everything is made fresh and you can taste the quality. Will definitely come back.",
    date: "2 weeks ago",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? "text-secondary fill-secondary"
              : "text-border dark:text-border-dark"
          }`}
        />
      ))}
    </div>
  );
}

export function ReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll carousel
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;
    let scrollPos = 0;

    const scroll = () => {
      if (!isPaused && container) {
        scrollPos += 0.5;
        if (scrollPos >= container.scrollWidth / 2) {
          scrollPos = 0;
        }
        container.scrollLeft = scrollPos;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  // Double the reviews for infinite scroll effect
  const doubledReviews = [...REVIEWS, ...REVIEWS];

  return (
    <section className="py-24 md:py-32 bg-primary/[0.02] dark:bg-white/[0.02] relative overflow-hidden">
      <div className="container-premium">
        {/* Section Header */}
        <AnimationWrapper type="fade" direction="up">
          <div className="text-center mb-16">
            <span className="text-secondary text-sm font-semibold uppercase tracking-[0.25em] mb-3 block">
              Testimonials
            </span>
            <h2 className="section-heading">What Our Guests Say</h2>
            <span className="heading-accent" />
          </div>
        </AnimationWrapper>
      </div>

      {/* Scrolling Reviews */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="flex gap-6 overflow-hidden px-6 hide-scrollbar"
      >
        {doubledReviews.map((review, index) => (
          <motion.div
            key={`${review.id}-${index}`}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="glass-card rounded-[var(--radius-lg)] p-6 min-w-[320px] max-w-[360px] shrink-0 cursor-default"
          >
            {/* Quote Icon */}
            <Quote className="w-8 h-8 text-secondary/20 mb-4" />

            {/* Comment */}
            <p className="text-dark/80 dark:text-white/80 text-sm leading-relaxed mb-6 line-clamp-4">
              &ldquo;{review.comment}&rdquo;
            </p>

            {/* Rating */}
            <StarRating rating={review.rating} />

            {/* Author */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/50 dark:border-border-dark/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {review.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-sm text-dark dark:text-white">
                  {review.name}
                </p>
                <p className="text-muted dark:text-muted-dark text-xs">
                  {review.date}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
