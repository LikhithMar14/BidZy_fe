"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Gavel,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Star,
  CheckCircle,
  Clock,
  DollarSign,
  Globe,
  ChevronDown,
  Eye,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import ScrollReveal from "@/components/ui/scroll-reveal";
import ParallaxContainer from "@/components/ui/parallax-container";

export default function HomePage() {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const features = [
    {
      icon: Gavel,
      title: "Live Bidding",
      description:
        "Experience real-time auctions with instant bid updates and live competition tracking across India.",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: Users,
      title: "Verified Community",
      description:
        "Connect with KYC-verified bidders and sellers across India in our secure auction ecosystem.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Shield,
      title: "RBI Compliant Security",
      description:
        "Bank-grade encryption and RBI-compliant security protocols protect every transaction.",
      color: "from-emerald-600 to-teal-600",
    },
    {
      icon: TrendingUp,
      title: "Market Intelligence",
      description:
        "AI-powered insights and Indian market analysis to optimize your bidding strategy.",
      color: "from-amber-500 to-yellow-500",
    },
    {
      icon: Clock,
      title: "24/7 Operations",
      description:
        "Round-the-clock auction monitoring with automated bid management across all time zones.",
      color: "from-green-600 to-emerald-600",
    },
    {
      icon: Globe,
      title: "Pan-India Logistics",
      description:
        "Seamless delivery across India with trusted logistics partners and comprehensive insurance.",
      color: "from-teal-500 to-cyan-500",
    },
  ];

  const stats = [
    { number: "2L+", label: "Active Users", icon: Users },
    { number: "10L+", label: "Auctions Completed", icon: Gavel },
    { number: "₹500Cr+", label: "Total Volume", icon: DollarSign },
    { number: "99.8%", label: "Success Rate", icon: Star },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Art Collector, Mumbai",
      avatar: "PS",
      content:
        "BidZy has revolutionized how I acquire rare Indian artworks. The authentication process and secure payments give me complete confidence in high-value transactions.",
      rating: 5,
    },
    {
      name: "Rajesh Gupta",
      role: "Antique Dealer, Delhi",
      avatar: "RG",
      content:
        "As a dealer specializing in Indian antiques, BidZy's platform has expanded my reach across the country. The professional tools and analytics have increased my sales by 400%.",
      rating: 5,
    },
    {
      name: "Meera Patel",
      role: "Jewelry Investor, Ahmedabad",
      avatar: "MP",
      content:
        "The most professional auction platform in India. Every piece is authenticated, and the delivery process is seamless. Highly recommended for serious collectors.",
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for individual collectors",
      features: [
        "Up to 10 bids per month",
        "Basic auction access",
        "Email support",
        "Standard verification",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "₹2,999",
      period: "/month",
      description: "For serious traders and dealers",
      features: [
        "Unlimited bidding",
        "Priority auction access",
        "Advanced analytics",
        "24/7 phone support",
        "Enhanced KYC verification",
        "API access",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "₹9,999",
      period: "/month",
      description: "For institutions and large dealers",
      features: [
        "Everything in Professional",
        "Dedicated relationship manager",
        "Custom integrations",
        "White-label solutions",
        "Advanced reporting",
        "SLA guarantee",
      ],
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "How does the live bidding system work in India?",
      answer:
        "Our enterprise-grade live bidding platform uses advanced WebSocket technology for real-time updates across India. You can participate in auctions from any city with sub-second latency and automatic bid management features.",
    },
    {
      question: "What security measures protect my transactions?",
      answer:
        "We employ bank-level encryption, multi-factor authentication, and comply with RBI guidelines and Indian data protection laws. All transactions are monitored by our fraud detection AI and backed by comprehensive insurance.",
    },
    {
      question: "How are items authenticated and verified?",
      answer:
        "Every item undergoes rigorous authentication by certified Indian experts and advanced AI verification systems. We work with renowned appraisers across India and provide detailed provenance reports with authenticity guarantees.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major Indian payment methods including UPI, NEFT, RTGS, credit/debit cards, and net banking. All payments are processed through RBI-approved payment gateways with instant confirmation.",
    },
    {
      question: "How does delivery work across India?",
      answer:
        "We partner with leading logistics companies for secure delivery across all Indian cities. High-value items receive white-glove delivery with real-time tracking and comprehensive insurance coverage.",
    },
    {
      question: "What support is available for enterprise clients?",
      answer:
        "Enterprise clients receive dedicated relationship management, 24/7 priority support in Hindi and English, custom training, and SLA-backed service guarantees with 99.9% uptime commitment.",
    },
  ];

  const recentAuctions = [
    {
      title: "Vintage Rolex Submariner",
      currentBid: "₹8,50,000",
      timeLeft: "02:45:30",
      bidders: 24,
      image:
        "http://googleusercontent.com/image_collection/image_retrieval/2552901643377337284_0",
    },
    {
      title: "Gupta Era Miniature Painting",
      currentBid: "₹12,00,000",
      timeLeft: "01:23:15",
      bidders: 18,
      image:
        "http://googleusercontent.com/image_collection/image_retrieval/9615414425331794260_0",
    },
    {
      title: "Traditional Kundan Jewelry Set",
      currentBid: "₹3,75,000",
      timeLeft: "04:12:45",
      bidders: 31,
      image:
        "http://googleusercontent.com/image_collection/image_retrieval/8701413169019614607_0",
    },
  ];

  const featuredAuctions = [
    {
      title: "1960 Ambassador Classic Car",
      currentBid: "₹15,00,000",
      timeLeft: "06:30:45",
      bidders: 12,
      image:
        "https://unsplash.com/photos/green-classic-car-parked-near-green-tree-during-daytime-7JOqsxyq1ac",
    },
    {
      title: "Ancient Sanskrit Manuscript",
      currentBid: "₹25,00,000",
      timeLeft: "03:15:20",
      bidders: 8,
      image:
        "http://googleusercontent.com/image_collection/image_retrieval/16408961697870977520_0",
    },
    {
      title: "Diamond Necklace - Jaipur Design",
      currentBid: "₹45,00,000",
      timeLeft: "05:45:10",
      bidders: 22,
      image:
        "http://googleusercontent.com/image_collection/image_retrieval/12974991456903892159_0",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
        {/* Subtle background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/5 via-transparent to-amber-900/5"></div>
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.03) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        {/* Enhanced floating orbs with parallax */}
        <ParallaxContainer speed={0.3} className="absolute top-20 left-20">
          <div className="w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-full blur-3xl" />
        </ParallaxContainer>
        <ParallaxContainer speed={-0.2} className="absolute bottom-20 right-20">
          <div className="w-80 h-80 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-full blur-3xl" />
        </ParallaxContainer>

        <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <ScrollReveal direction="left" duration={0.8}>
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center px-4 py-2 bg-emerald-500/10 backdrop-blur-md rounded-full text-sm font-medium border border-emerald-500/20"
                >
                  <Shield className="w-4 h-4 mr-2 text-emerald-400" />
                  <span className="text-emerald-300">
                    Trusted by 2,00,000+ professionals across India
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
                >
                  India's Premier
                  <span className="block bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                    Auction Platform
                  </span>
                  for Collectors & Dealers
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl"
                >
                  Enterprise-grade auction platform with advanced analytics,
                  pan-India reach, and RBI-compliant security for professional
                  traders, collectors, and institutions.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6"
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-gray-900 text-base sm:text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold rounded-lg"
                    asChild
                  >
                    <Link href="/dashboard">
                      Start Bidding Now
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-2 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-500/50 text-base sm:text-lg px-8 py-6 h-auto backdrop-blur-md transition-all duration-300 font-semibold rounded-lg bg-transparent"
                  >
                    <Link href="/demo">Schedule Demo</Link>
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                  className="flex flex-wrap items-center gap-6 text-sm"
                >
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
                    <span className="font-medium text-gray-300">
                      RBI Compliant
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
                    <span className="font-medium text-gray-300">
                      99.9% Uptime
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
                    <span className="font-medium text-gray-300">
                      24/7 Support
                    </span>
                  </div>
                </motion.div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" duration={0.8} delay={0.2}>
              <div className="relative flex justify-center lg:justify-end">
                {/* Enhanced 3D Container with Background Effects */}
                <div className="relative">
                  {/* Dynamic Background Orbs */}
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-teal-500/20 rounded-full blur-xl"
                  />
                  <motion.div
                    animate={{ 
                      rotate: [360, 0],
                      scale: [1.1, 1, 1.1],
                    }}
                    transition={{ 
                      rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                      scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-orange-500/20 rounded-full blur-xl"
                  />

                  <CardContainer className="inter-var max-w-md" containerClassName="py-8">
                    <CardBody className="relative group/card w-auto sm:w-[380px] h-auto rounded-2xl overflow-hidden">
                      {/* Advanced Background with Multiple Layers */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-950/95 via-gray-900/95 to-gray-950/95 backdrop-blur-xl" />
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-transparent to-amber-900/10" />
                      <div className="absolute inset-0 opacity-30">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.1)_0%,transparent_50%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.1)_0%,transparent_50%)]" />
                      </div>
                      
                      {/* Animated Border */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: "linear-gradient(45deg, transparent, rgba(34,197,94,0.3), transparent, rgba(245,158,11,0.3), transparent)",
                          backgroundSize: "300% 300%",
                          padding: "1px",
                        }}
                        animate={{
                          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <div className="w-full h-full bg-gray-950 rounded-2xl" />
                      </motion.div>

                      {/* Content Container with Enhanced Spacing */}
                      <div className="relative z-10 p-7 space-y-5">
                        {/* Enhanced Live Indicator */}
                        <CardItem translateZ="20" className="w-full">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <motion.div
                                  animate={{ 
                                    scale: [1, 1.3, 1],
                                    opacity: [1, 0.7, 1]
                                  }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="w-3 h-3 bg-emerald-500 rounded-full"
                                />
                                <motion.div
                                  animate={{ 
                                    scale: [1, 2, 1],
                                    opacity: [0.5, 0, 0.5]
                                  }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full"
                                />
                              </div>
                              <span className="text-sm font-bold tracking-wider text-emerald-300 uppercase">
                                Live Auction
                              </span>
                              <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full"
                              />
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-400 font-medium mb-1">
                                Current Bid
                              </p>
                              <motion.p
                                animate={{ 
                                  scale: [1, 1.05, 1],
                                  textShadow: [
                                    "0 0 0px rgba(245,158,11,0)",
                                    "0 0 20px rgba(245,158,11,0.5)",
                                    "0 0 0px rgba(245,158,11,0)"
                                  ]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="text-xl font-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 bg-clip-text text-transparent"
                              >
                                ₹8,50,000
                              </motion.p>
                            </div>
                          </div>
                        </CardItem>

                        {/* Enhanced Auction Item Image */}
                        <CardItem translateZ="120" className="w-full">
                          <div className="relative overflow-hidden rounded-xl group/image">
                            {/* Image Container with Advanced Effects */}
                            <div className="relative h-52 overflow-hidden bg-gradient-to-br from-blue-950/30 to-gray-900/30 backdrop-blur-sm">
                              {/* Floating Particles */}
                              <div className="absolute inset-0 opacity-20">
                                {[...Array(6)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                                    animate={{
                                      x: [Math.random() * 300, Math.random() * 300],
                                      y: [Math.random() * 200, Math.random() * 200],
                                      opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                      duration: 4 + Math.random() * 2,
                                      repeat: Infinity,
                                      delay: Math.random() * 2,
                                    }}
                                    style={{
                                      left: `${Math.random() * 100}%`,
                                      top: `${Math.random() * 100}%`,
                                    }}
                                  />
                                ))}
                              </div>

                              <motion.img
                                whileHover={{ scale: 1.08 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                src="https://upload.wikimedia.org/wikipedia/commons/d/df/Mohenjo-daro_Priesterk%C3%B6nig.jpeg"
                                alt="Indus Valley Artifact - Priest King"
                                className="w-full h-full object-cover transition-all duration-700 group-hover/image:brightness-110"
                              />
                              
                              {/* Enhanced Gradient Overlays */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-amber-900/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-500" />
                              
                              {/* Premium Badge */}
                              <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1, duration: 0.8 }}
                                className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-black shadow-lg"
                              >
                                PREMIUM
                              </motion.div>

                              {/* Enhanced Overlay Info */}
                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                                className="absolute bottom-4 left-4 right-4"
                              >
                                <div className="bg-black/80 backdrop-blur-lg rounded-lg p-3 border border-emerald-500/30 shadow-xl">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-white text-sm font-bold">
                                        Indus Valley Civilization
                                      </p>
                                      <p className="text-emerald-300 text-xs">
                                        3rd Millennium BCE
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-amber-400 fill-current" />
                                        <span className="text-xs text-amber-300 font-semibold">4.9</span>
                                      </div>
                                      <p className="text-xs text-gray-400">Authenticity</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                          </div>
                        </CardItem>

                        {/* Enhanced Stats Section */}
                        <CardItem translateZ="80" className="w-full">
                          <div className="grid grid-cols-3 gap-4">
                            {[
                              { icon: Clock, value: "02:45:30", label: "Time Left", color: "emerald", animate: "pulse" },
                              { icon: Users, value: "24", label: "Bidders", color: "amber", animate: "bounce" },
                              { icon: Eye, value: "156", label: "Watching", color: "blue", animate: "wiggle" }
                            ].map((stat, index) => (
                              <motion.div
                                key={stat.label}
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50 text-center hover:border-emerald-500/30 transition-all duration-300 group/stat"
                              >
                                <div className="flex items-center justify-center mb-2">
                                  <motion.div
                                    animate={
                                      stat.animate === "pulse" ? { scale: [1, 1.1, 1] } :
                                      stat.animate === "bounce" ? { y: [0, -2, 0] } :
                                      { rotate: [0, 5, -5, 0] }
                                    }
                                    transition={{ duration: 2, repeat: Infinity }}
                                  >
                                    <stat.icon className={`w-4 h-4 text-${stat.color}-400 group-hover/stat:text-${stat.color}-300 transition-colors duration-300`} />
                                  </motion.div>
                                </div>
                                <motion.div
                                  animate={
                                    stat.animate === "pulse" ? { opacity: [1, 0.7, 1] } : {}
                                  }
                                  transition={{ duration: 1, repeat: Infinity }}
                                  className={`text-white font-bold text-sm ${stat.animate === "pulse" ? "font-mono" : ""}`}
                                >
                                  {stat.value}
                                </motion.div>
                                <div className="text-xs text-gray-400 group-hover/stat:text-gray-300 transition-colors duration-300">
                                  {stat.label}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardItem>

                        {/* Enhanced Bidding Section */}
                        <CardItem translateZ="100" className="w-full space-y-4">
                          {/* Bid Amount Display */}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600/30"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 font-medium">Next bid (minimum)</span>
                              <motion.span
                                animate={{ 
                                  textShadow: [
                                    "0 0 0px rgba(34,197,94,0)",
                                    "0 0 10px rgba(34,197,94,0.5)",
                                    "0 0 0px rgba(34,197,94,0)"
                                  ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-emerald-300 font-bold text-lg"
                              >
                                ₹8,75,000
                              </motion.span>
                            </div>
                          </motion.div>
                          
                          {/* Enhanced Bid Button */}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-500 hover:via-green-500 hover:to-emerald-600 text-white font-bold py-4 text-base shadow-2xl rounded-xl group border border-emerald-500/30">
                              {/* Animated Background */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-white/20 via-emerald-300/20 to-white/20"
                                animate={{
                                  x: ["-100%", "100%"],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />
                              
                              {/* Sparkle Effects */}
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {[...Array(3)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-white rounded-full"
                                    animate={{
                                      scale: [0, 1, 0],
                                      opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                      duration: 1.5,
                                      repeat: Infinity,
                                      delay: i * 0.2,
                                    }}
                                    style={{
                                      left: `${20 + i * 30}%`,
                                      top: `${20 + Math.random() * 60}%`,
                                    }}
                                  />
                                ))}
                              </div>

                              <div className="relative z-10 flex items-center justify-center gap-3">
                                <motion.div
                                  animate={{ rotate: [0, 10, -10, 0] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <Gavel className="w-5 h-5" />
                                </motion.div>
                                <span className="text-lg font-black">Place Bid</span>
                                <motion.div
                                  animate={{ x: [0, 4, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  <ArrowRight className="w-4 h-4" />
                                </motion.div>
                              </div>
                            </Button>
                          </motion.div>
                          
                          {/* Enhanced Disclaimer */}
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            className="text-xs text-gray-500 text-center leading-relaxed"
                          >
                            By bidding, you agree to our{" "}
                            <span className="text-emerald-400 hover:text-emerald-300 cursor-pointer underline decoration-dotted">
                              terms & conditions
                            </span>
                          </motion.p>
                        </CardItem>

                        {/* Success Indicators */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 2 }}
                          className="absolute -bottom-2 -right-2 flex gap-2"
                        >
                          <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <div className="bg-amber-500 text-white p-2 rounded-full shadow-lg">
                            <Shield className="w-4 h-4" />
                          </div>
                        </motion.div>
                      </div>
                    </CardBody>
                  </CardContainer>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-900 to-gray-950 relative overflow-hidden">
        <ParallaxContainer speed={0.1} className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-500/5 to-green-500/5 rounded-full blur-3xl" />
        </ParallaxContainer>
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <ScrollReveal
                key={stat.label}
                direction="up"
                delay={index * 0.1}
                duration={0.8}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white relative z-10" />
                  </div>
                  <motion.div
                    initial={{ scale: 1 }}
                    whileInView={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3"
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-gray-400 font-medium">{stat.label}</div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24 bg-gray-950 relative overflow-hidden">
        <ParallaxContainer speed={0.2} className="absolute top-1/4 right-1/4">
          <div className="w-80 h-80 bg-gradient-to-r from-amber-500/5 to-yellow-500/5 rounded-full blur-3xl" />
        </ParallaxContainer>
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal direction="up" duration={0.8} className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Enterprise-Grade Features
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Built for Indian professionals who demand reliability, security,
              and performance
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {features.map((feature, index) => (
              <ScrollReveal
                key={feature.title}
                direction="up"
                delay={index * 0.15}
                duration={0.8}
              >
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="h-full group"
                >
                  <Card className="h-full border border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden hover:border-emerald-500/30 relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={false}
                    />
                    <CardContent className="p-6 sm:p-8 text-center relative z-10">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg relative overflow-hidden`}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.8 }}
                        />
                        <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white relative z-10" />
                      </motion.div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed text-base sm:text-lg">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Live Auctions Preview */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-gray-900 to-gray-950 relative overflow-hidden">
        <ParallaxContainer speed={-0.1} className="absolute bottom-1/4 left-1/3">
          <div className="w-72 h-72 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl" />
        </ParallaxContainer>
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal direction="up" duration={0.8} className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Live Auctions
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Premium items currently available for professional bidders across
              India
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-10 mb-16">
            {recentAuctions.map((auction, index) => (
              <ScrollReveal
                key={auction.title}
                direction="up"
                delay={index * 0.2}
                duration={0.8}
              >
                <motion.div
                  whileHover={{ y: -15, scale: 1.03 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full group"
                >
                  <Card className="overflow-hidden border border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl hover:border-emerald-500/30 h-full relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={false}
                    />
                    <div className="h-48 sm:h-56 overflow-hidden relative">
                      <motion.img
                        src={auction.image}
                        alt={auction.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-black/20"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute top-4 left-4">
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="flex items-center gap-2 bg-red-500/90 backdrop-blur-md rounded-full px-3 py-1 text-white text-sm font-semibold"
                        >
                          <motion.div
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-2 h-2 bg-white rounded-full"
                          />
                          LIVE
                        </motion.div>
                      </div>
                    </div>
                    <CardContent className="p-6 sm:p-8 relative z-10">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                        {auction.title}
                      </h3>
                      <div className="space-y-3 text-sm text-gray-400 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Current Bid:</span>
                          <motion.span
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                            className="font-bold text-amber-400 text-base sm:text-lg"
                          >
                            {auction.currentBid}
                          </motion.span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Time Left:</span>
                          <motion.span
                            animate={{ opacity: [1, 0.7, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="font-mono text-emerald-400 font-bold"
                          >
                            {auction.timeLeft}
                          </motion.span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Bidders:</span>
                          <span className="font-semibold text-white">
                            {auction.bidders} active
                          </span>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold py-3 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg overflow-hidden relative">
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.6 }}
                          />
                          <span className="relative z-10 flex items-center justify-center">
                            <Eye className="mr-2 w-5 h-5" />
                            View Auction
                          </span>
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          {/* Featured High-Value Auctions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Featured High-Value Auctions
            </h3>
            <p className="text-gray-400">
              Exclusive items for serious collectors and investors
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-10">
            {featuredAuctions.map((auction, index) => (
              <motion.div
                key={auction.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden border-2 border-amber-500/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl hover:border-amber-500/50">
                  <div className="h-48 sm:h-56 overflow-hidden relative">
                    <img
                      src={auction.image}
                      alt={auction.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-amber-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                      FEATURED
                    </div>
                  </div>
                  <CardContent className="p-6 sm:p-8">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
                      {auction.title}
                    </h3>
                    <div className="space-y-3 text-sm text-gray-400 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Current Bid:</span>
                        <span className="font-bold text-amber-400 text-base sm:text-lg">
                          {auction.currentBid}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Time Left:</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          {auction.timeLeft}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Bidders:</span>
                        <span className="font-semibold text-white">
                          {auction.bidders} active
                        </span>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-gray-900 font-bold py-3 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-lg">
                      <Eye className="mr-2 w-5 h-5" />
                      View Premium Auction
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 sm:py-24 bg-gray-950">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Trusted Across India
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              See what collectors, dealers, and investors across India say about
              our platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-10">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden hover:border-emerald-500/30">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center mb-4 sm:mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed text-base sm:text-lg">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg mr-4 sm:mr-5 shadow-lg">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base sm:text-lg">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-400 font-medium">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Professional Pricing
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Transparent pricing designed for the Indian market
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-10">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card
                  className={`h-full border-2 ${
                    plan.popular
                      ? "border-emerald-500 shadow-2xl"
                      : "border-gray-800 shadow-lg"
                  } relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
                >
                  <CardHeader className="text-center pb-4 sm:pb-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
                      {plan.name}
                    </h3>
                    <div className="mb-3 sm:mb-4">
                      <span className="text-4xl sm:text-5xl font-bold text-white">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-gray-400 text-lg sm:text-xl">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-base sm:text-lg">
                      {plan.description}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 mr-3 sm:mr-4 flex-shrink-0" />
                          <span className="text-gray-300 text-base sm:text-lg">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-gray-900 font-bold py-3 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-lg"
                    >
                      <Link href="/auth">Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-24 bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed">
              Everything you need to know about India's premier auction platform
            </p>
          </motion.div>

          <div className="space-y-4 sm:space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden hover:border-emerald-500/30">
                  <CardContent className="p-0">
                    <button
                      onClick={() =>
                        setActiveFAQ(activeFAQ === index ? null : index)
                      }
                      className="w-full px-6 sm:px-8 py-5 sm:py-6 text-left flex items-center justify-between hover:bg-emerald-500/5 transition-colors duration-200"
                    >
                      <span className="font-bold text-white text-base sm:text-lg">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 transition-transform duration-200 ${
                          activeFAQ === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {activeFAQ === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 sm:px-8 pb-5 sm:pb-6 text-gray-300 leading-relaxed text-base sm:text-lg"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Get in Touch
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Connect with our team across India for personalized support
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-10">
            <Card className="border border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden hover:border-emerald-500/30">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Phone Support
                </h3>
                <p className="text-gray-400 mb-4">
                  24/7 support in Hindi & English
                </p>
                <p className="text-emerald-400 font-semibold">
                  +91 98765 43210
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden hover:border-emerald-500/30">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Email Support
                </h3>
                <p className="text-gray-400 mb-4">Get detailed assistance</p>
                <p className="text-amber-400 font-semibold">support@bidzy.in</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden hover:border-emerald-500/30">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Office Locations
                </h3>
                <p className="text-gray-400 mb-4">Visit our offices</p>
                <p className="text-teal-400 font-semibold">
                  Mumbai | Delhi | Bangalore
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white relative overflow-hidden">
        {/* Subtle background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/10 via-transparent to-amber-900/10"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Start Professional Trading?
            </h2>
            <p className="text-lg sm:text-xl mb-8 sm:mb-10 text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Join thousands of professionals and institutions across India who
              trust BidZy for their auction needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-gray-900 text-base sm:text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold rounded-lg"
                asChild
              >
                <Link href="/auth">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-500/50 text-base sm:text-lg px-8 py-6 h-auto backdrop-blur-md transition-all duration-300 font-bold rounded-lg bg-transparent"
              >
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
