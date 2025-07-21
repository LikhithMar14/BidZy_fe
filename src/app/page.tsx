
"use client"
import Link from "next/link"
import { motion } from "framer-motion"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useState } from "react"

export default function HomePage() {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null)

  const features = [
    {
      icon: Gavel,
      title: "Live Bidding",
      description: "Experience real-time auctions with instant bid updates and live competition tracking across India.",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: Users,
      title: "Verified Community",
      description: "Connect with KYC-verified bidders and sellers across India in our secure auction ecosystem.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Shield,
      title: "RBI Compliant Security",
      description: "Bank-grade encryption and RBI-compliant security protocols protect every transaction.",
      color: "from-emerald-600 to-teal-600",
    },
    {
      icon: TrendingUp,
      title: "Market Intelligence",
      description: "AI-powered insights and Indian market analysis to optimize your bidding strategy.",
      color: "from-amber-500 to-yellow-500",
    },
    {
      icon: Clock,
      title: "24/7 Operations",
      description: "Round-the-clock auction monitoring with automated bid management across all time zones.",
      color: "from-green-600 to-emerald-600",
    },
    {
      icon: Globe,
      title: "Pan-India Logistics",
      description: "Seamless delivery across India with trusted logistics partners and comprehensive insurance.",
      color: "from-teal-500 to-cyan-500",
    },
  ]

  const stats = [
    { number: "2L+", label: "Active Users", icon: Users },
    { number: "10L+", label: "Auctions Completed", icon: Gavel },
    { number: "₹500Cr+", label: "Total Volume", icon: DollarSign },
    { number: "99.8%", label: "Success Rate", icon: Star },
  ]

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
  ]

  const pricingPlans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for individual collectors",
      features: ["Up to 10 bids per month", "Basic auction access", "Email support", "Standard verification"],
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
  ]

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
  ]

  const recentAuctions = [
    {
      title: "Vintage Rolex Submariner",
      currentBid: "₹8,50,000",
      timeLeft: "02:45:30",
      bidders: 24,
      image: "http://googleusercontent.com/image_collection/image_retrieval/2552901643377337284_0",
    },
    {
      title: "Gupta Era Miniature Painting",
      currentBid: "₹12,00,000",
      timeLeft: "01:23:15",
      bidders: 18,
      image: "http://googleusercontent.com/image_collection/image_retrieval/9615414425331794260_0",
    },
    {
      title: "Traditional Kundan Jewelry Set",
      currentBid: "₹3,75,000",
      timeLeft: "04:12:45",
      bidders: 31,
      image: "http://googleusercontent.com/image_collection/image_retrieval/8701413169019614607_0",
    },
  ]

  const featuredAuctions = [
    {
      title: "1960 Ambassador Classic Car",
      currentBid: "₹15,00,000",
      timeLeft: "06:30:45",
      bidders: 12,
      image: "https://unsplash.com/photos/green-classic-car-parked-near-green-tree-during-daytime-7JOqsxyq1ac",
    },
    {
      title: "Ancient Sanskrit Manuscript",
      currentBid: "₹25,00,000",
      timeLeft: "03:15:20",
      bidders: 8,
      image: "http://googleusercontent.com/image_collection/image_retrieval/16408961697870977520_0",
    },
    {
      title: "Diamond Necklace - Jaipur Design",
      currentBid: "₹45,00,000",
      timeLeft: "05:45:10",
      bidders: 22,
      image: "http://googleusercontent.com/image_collection/image_retrieval/12974991456903892159_0",
    },
  ]

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

        {/* Subtle floating orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 backdrop-blur-md rounded-full text-sm font-medium border border-emerald-500/20">
                <Shield className="w-4 h-4 mr-2 text-emerald-400" />
                <span className="text-emerald-300">Trusted by 2,00,000+ professionals across India</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                India's Premier
                <span className="block bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                  Auction Platform
                </span>
                for Collectors & Dealers
              </h1>

              <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                Enterprise-grade auction platform with advanced analytics, pan-India reach, and RBI-compliant security
                for professional traders, collectors, and institutions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
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
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
                  <span className="font-medium text-gray-300">RBI Compliant</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
                  <span className="font-medium text-gray-300">99.9% Uptime</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
                  <span className="font-medium text-gray-300">24/7 Support</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-emerald-500/20 shadow-2xl">
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold tracking-wide text-emerald-300">LIVE AUCTION</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400 font-medium">Current Bid</p>
                      <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                        ₹8,50,000
                      </p>
                    </div>
                  </div>

                  <div className="mb-6 sm:mb-8">
                    <img
                      src="http://googleusercontent.com/image_collection/image_retrieval/2552901643377337284_0"
                      alt="Vintage Rolex Submariner"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>

                  <div className="space-y-4 mb-6 sm:mb-8">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-medium">Time Left</span>
                      <span className="text-white font-mono text-lg">02:45:30</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-medium">Bidders</span>
                      <span className="text-white font-semibold">24 active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-medium">Item</span>
                      <span className="text-white font-semibold">Vintage Rolex</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold py-3 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-lg">
                    <Gavel className="mr-2 w-5 h-5" />
                    Place Bid
                  </Button>
                </div>
              </div>

              {/* Subtle floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute -top-6 -right-6 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border border-amber-500/20"
              >
                <Star className="w-8 sm:w-10 h-8 sm:h-10 text-amber-400" />
              </motion.div>
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-6 -left-6 w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border border-emerald-500/20"
              >
                <Zap className="w-6 sm:w-8 h-6 sm:h-8 text-emerald-400" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                  <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">{stat.number}</div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Enterprise-Grade Features
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Built for Indian professionals who demand reliability, security, and performance
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden hover:border-emerald-500/30">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                    >
                      <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-base sm:text-lg">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Auctions Preview */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">Live Auctions</h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Premium items currently available for professional bidders across India
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-10 mb-16">
            {recentAuctions.map((auction, index) => (
              <motion.div
                key={auction.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden border border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl hover:border-emerald-500/30">
                  <div className="h-48 sm:h-56 overflow-hidden">
                    <img
                      src={auction.image}
                      alt={auction.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6 sm:p-8">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-4">{auction.title}</h3>
                    <div className="space-y-3 text-sm text-gray-400 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Current Bid:</span>
                        <span className="font-bold text-amber-400 text-base sm:text-lg">{auction.currentBid}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Time Left:</span>
                        <span className="font-mono text-emerald-400 font-bold">{auction.timeLeft}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Bidders:</span>
                        <span className="font-semibold text-white">{auction.bidders} active</span>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold py-3 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-lg">
                      <Eye className="mr-2 w-5 h-5" />
                      View Auction
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
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
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Featured High-Value Auctions</h3>
            <p className="text-gray-400">Exclusive items for serious collectors and investors</p>
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
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-4">{auction.title}</h3>
                    <div className="space-y-3 text-sm text-gray-400 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Current Bid:</span>
                        <span className="font-bold text-amber-400 text-base sm:text-lg">{auction.currentBid}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Time Left:</span>
                        <span className="font-mono text-emerald-400 font-bold">{auction.timeLeft}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Bidders:</span>
                        <span className="font-semibold text-white">{auction.bidders} active</span>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">Trusted Across India</h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              See what collectors, dealers, and investors across India say about our platform
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
                        <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-current" />
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
                        <h4 className="font-bold text-white text-base sm:text-lg">{testimonial.name}</h4>
                        <p className="text-gray-400 font-medium">{testimonial.role}</p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">Professional Pricing</h2>
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
                    plan.popular ? "border-emerald-500 shadow-2xl" : "border-gray-800 shadow-lg"
                  } relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
                >
                  <CardHeader className="text-center pb-4 sm:pb-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">{plan.name}</h3>
                    <div className="mb-3 sm:mb-4">
                      <span className="text-4xl sm:text-5xl font-bold text-white">{plan.price}</span>
                      {plan.period && <span className="text-gray-400 text-lg sm:text-xl">{plan.period}</span>}
                    </div>
                    <p className="text-gray-400 text-base sm:text-lg">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 mr-3 sm:mr-4 flex-shrink-0" />
                          <span className="text-gray-300 text-base sm:text-lg">{feature}</span>
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
                      onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                      className="w-full px-6 sm:px-8 py-5 sm:py-6 text-left flex items-center justify-between hover:bg-emerald-500/5 transition-colors duration-200"
                    >
                      <span className="font-bold text-white text-base sm:text-lg">{faq.question}</span>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">Get in Touch</h2>
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
                <h3 className="text-xl font-bold text-white mb-4">Phone Support</h3>
                <p className="text-gray-400 mb-4">24/7 support in Hindi & English</p>
                <p className="text-emerald-400 font-semibold">+91 98765 43210</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden hover:border-emerald-500/30">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Email Support</h3>
                <p className="text-gray-400 mb-4">Get detailed assistance</p>
                <p className="text-amber-400 font-semibold">support@bidzy.in</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden hover:border-emerald-500/30">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Office Locations</h3>
                <p className="text-gray-400 mb-4">Visit our offices</p>
                <p className="text-teal-400 font-semibold">Mumbai | Delhi | Bangalore</p>
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
              Join thousands of professionals and institutions across India who trust BidZy for their auction needs
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
  )
}
