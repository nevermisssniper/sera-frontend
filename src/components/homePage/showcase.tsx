"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const showcaseImages = [
  "/images/32.webp",
  "/images/25.webp",
  "/images/15.webp",
];

const Showcase = ({ id }: { id: string }) => {
  return (
    <section id={id} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold text-center mb-12 text-violet-700"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          Our AI-Generated Headshots
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {showcaseImages.map((src, index) => (
            <motion.div
              key={index}
              className="relative rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Image
                src={src}
                alt={`Showcase ${index + 1}`}
                width={400}
                height={400}
                className="object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Showcase;
