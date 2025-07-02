"use client";

import { motion } from "framer-motion";

const reviews = [
  {
    name: "Mark Zidan",
    text: "I was on the hunt for an AI LinkedIn photo generator, and my professional headshots from Headshot-AI turned out so beautifully! Really high quality and accuracy. This is way, way better than any other AI headshot generator I've seen.",
  },
  {
    name: "Joan L.",
    text: "Headshot-AI is the best AI headshot generator by far! I can't believe how natural my new professional headshots look.",
  },
  {
    name: "Daniel Yao",
    text: "I was unsure about the process. But I took a leap of faith, and I am pleasantly surprised by my AI headshots! Definitely more affordable than a professional photographer. I'd recommend it!",
  },
];

const Reviews = ({ id }: { id: string }) => {
  return (
    <section id={id} className="py-20 bg-violet-50">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold text-center mb-12 text-violet-700"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          What Our Customers Say
        </motion.h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md max-w-md"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <p className="text-lg mb-4">“{review.text}”</p>
              <p className="text-sm font-semibold text-right text-violet-700">
                – {review.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
