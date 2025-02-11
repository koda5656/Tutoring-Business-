import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import ProductShowcase from "@/components/home/ProductShowcase";
import { Package } from "@shared/schema";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Header />
      <main className="container mx-auto px-4">
        <Hero />
        <Features />
        <ProductShowcase />
      </main>
      {/* Glass-morphic footer */}
      <footer className="mt-20 border-t border-gray-800 bg-black/30 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-gray-400">
            © 2025 TutorPro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}