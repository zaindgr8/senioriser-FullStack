"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";



const slides = [
  {
    image: "/senior1.jpeg",
  
  },
  {
    image: "/senior2.jpeg",
    
  },
  {
    image: "/senior3.jpeg",

  },
];

const Slideshow = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSlideIndex((prevSlideIndex) => (prevSlideIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="">
      <AnimatePresence mode="wait">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{
              opacity: slideIndex === index ? 1 : 0,
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 object-cover"
          >
            <Image src={slide.image} layout="fill" alt={slide.text} />
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="absolute top-0 left-0 z-10 px-4 py-4 text-white">
        <h1 className="text-3xl font-bold">{slides[slideIndex].text}</h1>
      </div>
    </div>
  );
};

export default Slideshow;
