// components/ui/SectionWrapper.tsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ 
  id, 
  className, 
  children 
}) => {
  return (
    <motion.section
      id={id}
      className={cn(
        "relative min-h-screen flex flex-col justify-center",
        className
      )}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}
    </motion.section>
  );
};