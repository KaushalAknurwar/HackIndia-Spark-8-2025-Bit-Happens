import { motion } from "framer-motion";
import { TestimonialCard } from "@/components/ui/testimonial-card";

const testimonials = [
  {
    author: {
      name: "Sarah J.",
      handle: "@sarahj",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "This app has changed how I understand my emotions!",
  },
  {
    author: {
      name: "Michael R.",
      handle: "@michaelr",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "The daily mood tracking has helped me identify patterns I never noticed before.",
  },
  {
    author: {
      name: "Emma L.",
      handle: "@emmal",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "Simple yet powerful. Exactly what I needed for my mental wellness journey.",
  }
];

export const Testimonials = () => {
  return (
    <section className="relative py-20 bg-black/5 backdrop-blur-lg overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center text-white mb-12"
        >
          What Our Users Say
        </motion.h2>

        <div className="relative w-full">
          <div className="group flex overflow-hidden p-2 [--gap:2rem] [gap:var(--gap)] [--duration:60s]">
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee group-hover:[animation-play-state:paused]">
              {[...Array(2)].map((_, setIndex) => (
                testimonials.map((testimonial, i) => (
                  <TestimonialCard 
                    key={`${setIndex}-${i}`}
                    {...testimonial}
                  />
                ))
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#1A1A2E] via-[#1A1A2E]/80 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#1A1A2E] via-[#1A1A2E]/80 to-transparent" />
        </div>
      </div>
    </section>
  );
};