import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import GridPattern from "../ui/patterns/GridPattern";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-black">
      <GridPattern />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-gray-800 text-gray-200 rounded-full"
          >
            Expert Tutoring Services
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Unlock Your Academic Potential With Expert Tutors
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-gray-400 mb-10"
          >
            Personalized 1-on-1 tutoring in Mathematics, Science, Languages, and more. Join thousands of students achieving academic excellence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="bg-white text-black hover:bg-gray-100">
              Book Your First Session
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Browse Subjects
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}