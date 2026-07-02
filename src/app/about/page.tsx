"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AboutSection } from "@/components/home/AboutSection";
import { AnimationWrapper } from "@/components/shared/AnimationWrapper";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 bg-background dark:bg-background-dark min-h-screen">
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
