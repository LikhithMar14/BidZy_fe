"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, Star, Sparkles, X, Zap, Gem } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CongratulationsProps {
  isVisible: boolean;
  onClose: () => void;
  winnerName: string;
  auctionTitle: string;
  finalBid: number;
  auctionImage?: string;
}

export const GraffitiCongratulations: React.FC<CongratulationsProps> = ({
  isVisible,
  onClose,
  winnerName,
  auctionTitle,
  finalBid,
  auctionImage
}) => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    if (isVisible) {
      // Trigger confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      // Animation phases
      const phases = [0, 1, 2, 3];
      phases.forEach((phase, index) => {
        setTimeout(() => setAnimationPhase(phase), index * 500);
      });

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0.5, rotate: 10 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20,
            duration: 0.6
          }}
          className="relative max-w-2xl w-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Graffiti Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 text-6xl font-black text-white rotate-12">WIN!</div>
            <div className="absolute bottom-10 right-10 text-4xl font-black text-white -rotate-12">WINNER</div>
            <div className="absolute top-1/2 left-1/4 text-2xl font-black text-white rotate-45">🏆</div>
            <div className="absolute top-1/3 right-1/4 text-3xl font-black text-white -rotate-30">💎</div>
          </div>

          {/* Main Content */}
          <div className="relative p-8 text-center">
            {/* Animated Trophy */}
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <div className="relative inline-block">
                <motion.div
                  animate={{ 
                    rotate: animationPhase >= 1 ? [0, -10, 10, -5, 5, 0] : 0,
                    scale: animationPhase >= 1 ? [1, 1.1, 1] : 1
                  }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  className="relative"
                >
                  <Trophy className="w-24 h-24 text-yellow-300 drop-shadow-lg" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-2 -right-2"
                  >
                    <Crown className="w-8 h-8 text-yellow-400" />
                  </motion.div>
                </motion.div>
                
                {/* Sparkles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: animationPhase >= 2 ? [0, 1, 0] : 0,
                      scale: animationPhase >= 2 ? [0, 1, 0] : 0,
                      x: animationPhase >= 2 ? [0, Math.cos(i * 60 * Math.PI / 180) * 40, 0] : 0,
                      y: animationPhase >= 2 ? [0, Math.sin(i * 60 * Math.PI / 180) * 40, 0] : 0
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: i * 0.1,
                      repeatDelay: 1
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Graffiti-style Congratulations */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="mb-4"
            >
              <h1 className="text-5xl sm:text-6xl font-black text-white mb-2 drop-shadow-lg transform -rotate-2"
                  style={{
                    fontFamily: '"Fredoka One", cursive',
                    textShadow: '4px 4px 0px rgba(0,0,0,0.3), 8px 8px 0px rgba(0,0,0,0.1)'
                  }}>
                CONGRATULATIONS!
              </h1>
              <motion.div
                animate={{ rotate: [0, 2, -2, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-yellow-300 drop-shadow-md"
                    style={{
                      fontFamily: '"Fredoka One", cursive',
                      textShadow: '2px 2px 0px rgba(0,0,0,0.3)'
                    }}>
                  {winnerName.toUpperCase()}
                </h2>
              </motion.div>
            </motion.div>

            {/* Winner Details */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {auctionImage && (
                  <div className="relative">
                    <img
                      src={auctionImage}
                      alt={auctionTitle}
                      className="w-20 h-20 rounded-xl object-cover border-4 border-white/30"
                    />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-1 -right-1"
                    >
                      <Gem className="w-6 h-6 text-yellow-300" />
                    </motion.div>
                  </div>
                )}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-white mb-1">{auctionTitle}</h3>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Zap className="w-5 h-5 text-yellow-300" />
                    <span className="text-2xl font-bold text-yellow-300">
                      ${finalBid.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Button */}
            <motion.button
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-4 bg-white text-orange-600 font-bold text-lg rounded-full hover:bg-yellow-100 transition-colors shadow-lg"
              style={{ fontFamily: '"Fredoka One", cursive' }}
            >
              AWESOME! 🎉
            </motion.button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400"></div>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-300"></div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 