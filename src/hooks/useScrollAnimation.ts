"use client";
import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

interface UseScrollAnimationProps {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
}

export function useScrollAnimation({
  threshold = 0.1,
  triggerOnce = true,
  rootMargin = "-100px 0px",
}: UseScrollAnimationProps = {}) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { 
    threshold, 
    once: triggerOnce,
    margin: rootMargin 
  });

  return { ref, isInView };
}

export function useParallax(speed: number = 0.5) {
  const scrollY = useMotionValue(0);
  const y = useTransform(scrollY, [0, 1], [0, speed * 100]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const progress = scrollTop / windowHeight;
      scrollY.set(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);

  return y;
}

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / documentHeight;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollProgress;
}

export function useSmoothReveal() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "-50px 0px",
      }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, []);

  return { ref, isVisible };
} 