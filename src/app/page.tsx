import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { MenuOfTheDay } from "@/components/home/MenuOfTheDay";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="bg-background">
        <HeroSection />
        <CategoriesGrid />
        <FeaturedProducts />
        <MenuOfTheDay />
      </main>
      <Footer />
    </>
  );
}
