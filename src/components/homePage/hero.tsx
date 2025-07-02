"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const Hero = ({ id }: { id: string }) => {
  return (
    <section
      id={id}
      className="bg-gradient-to-r from-violet-700 to-violet-400 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex gap-4"
      >
        <Image
          src="/images/11.webp" // Replace with your image path
          alt="AI Generated Headshot Example"
          width={300}
          height={300}
          className="rounded-3xl shadow-lg"
        />
        <Image
          src="/images/28.webp" // Replace with your image path
          alt="AI Generated Headshot Example"
          width={300}
          height={300}
          className="rounded-3xl shadow-lg"
        />
        <Image
          src="/images/3.webp" // Replace with your image path
          alt="AI Generated Headshot Example"
          width={300}
          height={300}
          className="rounded-3xl shadow-lg"
        />
      </motion.div>

      <motion.h1
        className="text-5xl font-extrabold text-white my-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Upgrade Your <span className="text-zinc-900">Headshots</span> in Seconds
      </motion.h1>

      <motion.p
        className="text-xl text-white max-w-2xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        Use Headshot-AI to save time and money. Get professional AI-generated
        headshots tailored to your needs.
      </motion.p>

      <motion.div
        className="flex space-x-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        {/* Primary CTA -> Get Started (/signup) */}
        <Button asChild>
          <Link href="/signup">Get Started</Link>
        </Button>

        {/* Secondary CTA -> Log In (/login) */}
        <Button asChild variant="secondary">
          <Link href="/login">Log In</Link>
        </Button>
      </motion.div>

      {/* Scroll down indicator */}
      <motion.div
        className="absolute bottom-8"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          y: [0, 10, 0],
        }}
        transition={{
          delay: 2,
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <ChevronDown className="h-8 w-8 text-white" />
      </motion.div>
    </section>
  );
};

export default Hero;
