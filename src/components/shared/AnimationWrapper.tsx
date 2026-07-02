"use client";

import React, { useRef } from "react";
import { motion, useInView, type Variant } from "framer-motion";

type AnimationDirection = "up" | "down" | "left" | "right" | "none";
type AnimationType = "fade" | "slide" | "scale" | "slideScale";

interface AnimationWrapperProps {
  children: React.ReactNode;
  type?: AnimationType;
  direction?: AnimationDirection;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
  staggerChildren?: number;
}

const getDirectionOffset = (direction: AnimationDirection, distance = 40) => {
  switch (direction) {
    case "up":    return { y: distance };
    case "down":  return { y: -distance };
    case "left":  return { x: distance };
    case "right": return { x: -distance };
    case "none":  return {};
  }
};

const getVariants = (
  type: AnimationType,
  direction: AnimationDirection,
  duration: number
): { hidden: Variant; visible: Variant } => {
  const offset = getDirectionOffset(direction);

  switch (type) {
    case "fade":
      return {
        hidden: { opacity: 0, ...offset },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration, ease: [0.25, 0.4, 0.25, 1] },
        },
      };
    case "slide":
      return {
        hidden: { opacity: 0, ...offset },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration, ease: [0.25, 0.4, 0.25, 1] },
        },
      };
    case "scale":
      return {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { duration, ease: [0.25, 0.4, 0.25, 1] },
        },
      };
    case "slideScale":
      return {
        hidden: { opacity: 0, scale: 0.95, ...offset },
        visible: {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          transition: { duration, ease: [0.25, 0.4, 0.25, 1] },
        },
      };
  }
};

export function AnimationWrapper({
  children,
  type = "fade",
  direction = "up",
  delay = 0,
  duration = 0.5,
  className = "",
  once = true,
  amount = 0.2,
  staggerChildren,
}: AnimationWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });
  const variants = getVariants(type, direction, duration);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: variants.hidden,
        visible: {
          ...variants.visible,
          transition: {
            ...(variants.visible as Record<string, unknown>).transition as object,
            delay,
            ...(staggerChildren && {
              staggerChildren,
              delayChildren: delay,
            }),
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger container for child animations
export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Individual stagger item
export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Parallax wrapper
export function ParallaxWrapper({
  children,
  speed = 0.5,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ y: 0 }}
      whileInView={{ y: -30 * speed }}
      viewport={{ once: false }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
