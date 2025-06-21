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
  Award,
  ChevronDown,
  Play,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  Eye,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";


export default function HomePage() {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);


  const features = [
    {
      icon: Gavel,
      title: "Live Bidding",
      description:
        "Experience the thrill of real-time auctions with instant bid updates and live competition.",
      color: "from-rose-500 to-pink-600",
    },
    {
      icon: Users,
      title: "Global Community",
      description:
        "Join thousands of bidders from around the world in our vibrant auction community.",
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: Shield,
      title: "Secure & Trusted",
      description:
        "Your security is our priority with encrypted transactions and verified sellers.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: TrendingUp,
      title: "Best Deals",
      description:
        "Find unique items at competitive prices with our smart bidding system.",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Clock,
      title: "24/7 Auctions",
      description:
        "Never miss an auction with our round-the-clock bidding platform.",
      color: "from-rose-500 to-red-600",
    },
    {
      icon: Globe,
      title: "Worldwide Shipping",
      description:
        "Get your items delivered anywhere in the world with our trusted partners.",
      color: "from-cyan-500 to-sky-600",
    },
  ];


  const stats = [
    { number: "10K+", label: "Active Users", icon: Users },
    { number: "50K+", label: "Auctions Completed", icon: Gavel },
    { number: "$2M+", label: "Total Value", icon: DollarSign },
    { number: "99.9%", label: "Satisfaction Rate", icon: Star },
  ];


  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Art Collector",
      avatar: "SJ",
      content:
        "BidZy has transformed how I collect art. The live bidding experience is incredible and I've found some amazing pieces.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Antique Dealer",
      avatar: "MC",
      content:
        "As a seller, I love the global reach BidZy provides. My items get more exposure and better prices than ever before.",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      role: "Jewelry Enthusiast",
      avatar: "ER",
      content:
        "The security features give me peace of mind. I've won several valuable pieces and the transactions are always smooth.",
      rating: 5,
    },
  ];


  const pricingPlans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for getting started",
      features: [
        "Up to 5 bids per month",
        "Basic auction access",
        "Email support",
        "Standard shipping",
      ],
      popular: false,
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/month",
      description: "For serious bidders",
      features: [
        "Unlimited bids",
        "Priority auction access",
        "Live chat support",
        "Express shipping",
        "Bid history analytics",
        "Early access to auctions",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$29.99",
      period: "/month",
      description: "For businesses and dealers",
      features: [
        "Everything in Pro",
        "Bulk listing tools",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced analytics",
      ],
      popular: false,
    },
  ];


  const faqs = [
    {
      question: "How does live bidding work?",
      answer:
        "Live bidding allows you to participate in real-time auctions from anywhere in the world. You can see current bids, place your own bids, and watch the auction unfold in real-time with live video streaming.",
    },
    {
      question: "Is my payment information secure?",
      answer:
        "Yes, we use bank-level encryption and security measures to protect your payment information. All transactions are processed through secure payment gateways and we never store your full credit card details.",
    },
    {
      question: "What happens if I win an auction?",
      answer:
        "When you win an auction, you'll receive an immediate notification. You'll have 24 hours to complete payment, and then the seller will ship your item within 3-5 business days.",
    },
    {
      question: "Can I cancel a bid?",
      answer:
        "Bids are binding and cannot be cancelled once placed. Please make sure you're certain about your bid amount before placing it. We recommend setting a maximum budget before bidding.",
    },
    {
      question: "How do I know if an item is authentic?",
      answer:
        "All items on BidZy are verified by our expert team. We work with certified appraisers and use advanced authentication technology to ensure the authenticity of all items listed on our platform.",
    },
    {
      question: "What if I'm not satisfied with my purchase?",
      answer:
        "We offer a 30-day satisfaction guarantee. If you're not completely satisfied with your purchase, you can return it for a full refund, no questions asked.",
    },
  ];


  const recentAuctions = [
    {
      title: "Vintage Rolex Submariner",
      currentBid: "$2,450",
      timeLeft: "02:45:30",
      bidders: 12,
      image: "⌚",
    },
    {
      title: "Original Picasso Sketch",
      currentBid: "$15,200",
      timeLeft: "01:23:15",
      bidders: 8,
      image: "🎨",
    },
    {
      title: "Antique Persian Rug",
      currentBid: "$3,800",
      timeLeft: "04:12:45",
      bidders: 15,
      image: "🟫",
    },
  ];


  // Consistent gradient styles
  const primaryGradient = "from-rose-500 to-pink-600";
  const secondaryGradient = "from-violet-500 to-purple-600";
  const accentGradient = "from-amber-500 to-orange-600";
  const darkGradient = "from-gray-900 to-gray-800";
  const lightGradient = "from-gray-50 to-white";


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 text-white">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 2px, transparent 2px)`,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>


        {/* Floating gradient orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-violet-400/20 to-purple-400/20 rounded-full blur-3xl"></div>


        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/15 backdrop-blur-md rounded-full text-sm font-medium border border-white/20">
                <Star className="w-4 h-4 mr-2 text-amber-300" />
                Trusted by 10,000+ users worldwide
              </div>


              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                Experience the
                <span className="block bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                  Thrill of Live
                </span>
                Auctions
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-rose-100 leading-relaxed max-w-2xl">
                Join thousands of bidders in real-time auctions. Find unique
                items, place competitive bids, and win amazing deals from
                anywhere in the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-white to-gray-100 text-rose-600 hover:from-gray-100 hover:to-white text-base sm:text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold rounded-xl"
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
                  className="p-0 border-none bg-transparent"
                >
                  <Link
                    href="/auth/login"
                    className="border-2 border-white/30 text-white hover:bg-white hover:text-rose-600 text-base sm:text-lg px-8 py-6 h-auto backdrop-blur-md hover:border-white transition-all duration-300 font-semibold rounded-xl flex items-center justify-center"
                  >
                    Create Account
                  </Link>
                </Button>
              </div>


              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <span className="font-medium">No registration fees</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <span className="font-medium">Secure payments</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <span className="font-medium">24/7 support</span>
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
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold tracking-wide">
                        LIVE AUCTION
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-rose-200 font-medium">
                        Current Bid
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                        $2,450
                      </p>
                    </div>
                  </div>


                  <div className="space-y-4 mb-6 sm:mb-8">
                    <div className="flex items-center justify-between">
                      <span className="text-rose-200 font-medium">
                        Time Left
                      </span>
                      <span className="text-white font-mono text-lg">
                        02:45:30
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-rose-200 font-medium">Bidders</span>
                      <span className="text-white font-semibold">
                        12 active
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-rose-200 font-medium">Item</span>
                      <span className="text-white font-semibold">
                        Vintage Rolex
                      </span>
                    </div>
                  </div>


                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-xl">
                    <Gavel className="mr-2 w-5 h-5" />
                    Place Bid
                  </Button>
                </div>
              </div>


              {/* Enhanced floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-6 -right-6 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-2xl"
              >
                <Star className="w-8 sm:w-10 h-8 sm:h-10 text-amber-800" />
              </motion.div>


              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-6 -left-6 w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full flex items-center justify-center shadow-2xl"
              >
                <Zap className="w-6 sm:w-8 h-6 sm:h-8 text-violet-800" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-white">
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
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                  <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Why Choose BidZy?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the future of online auctions with our cutting-edge
              platform designed for both buyers and sellers
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
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white rounded-xl overflow-hidden">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                    >
                      <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Live Auctions Preview */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Live Auctions Happening Now
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Don't miss out on these exciting items currently up for auction
            </p>
          </motion.div>


          <div className="grid md:grid-cols-3 gap-8 sm:gap-10">
            {recentAuctions.map((auction, index) => (
              <motion.div
                key={auction.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white rounded-xl">
                  <div className="h-48 sm:h-56 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
                    <span className="text-6xl sm:text-8xl">
                      {auction.image}
                    </span>
                  </div>
                  <CardContent className="p-6 sm:p-8">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                      {auction.title}
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Current Bid:</span>
                        <span className="font-bold text-emerald-600 text-base sm:text-lg">
                          {auction.currentBid}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Time Left:</span>
                        <span className="font-mono text-rose-600 font-bold">
                          {auction.timeLeft}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Bidders:</span>
                        <span className="font-semibold">
                          {auction.bidders} active
                        </span>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-3 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-xl">
                      <Eye className="mr-2 w-5 h-5" />
                      View Auction
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              What Our Users Say
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied users who have found amazing deals on
              BidZy
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
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white rounded-xl overflow-hidden">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center mb-4 sm:mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed text-base sm:text-lg">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg mr-4 sm:mr-5 shadow-lg">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base sm:text-lg">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-500 font-medium">
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
      <section className="py-20 sm:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Choose Your Plan
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Start free and upgrade as you grow. No hidden fees, cancel
              anytime.
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
                    <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card
                  className={`h-full border-2 ${plan.popular
                      ? "border-rose-500 shadow-2xl"
                      : "border-gray-200 shadow-lg"
                    } relative bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
                >
                  <CardHeader className="text-center pb-4 sm:pb-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                      {plan.name}
                    </h3>
                    <div className="mb-3 sm:mb-4">
                      <span className="text-4xl sm:text-5xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-gray-500 text-lg sm:text-xl">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-base sm:text-lg">
                      {plan.description}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 mr-3 sm:mr-4 flex-shrink-0" />
                          <span className="text-gray-700 text-base sm:text-lg">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-3 sm:py-4 text-base sm:text-lg
                     shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-xl"
                    >
                      <Link
                        href="/auth"
                        className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-3 sm:py-4 text-base sm:text-lg
                     shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-xl"
                      >
                        Get Started
                      </Link>
                    </Button>




                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Everything you need to know about BidZy
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
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-xl overflow-hidden">
                  <CardContent className="p-0">
                    <button
                      onClick={() =>
                        setActiveFAQ(activeFAQ === index ? null : index)
                      }
                      className="w-full px-6 sm:px-8 py-5 sm:py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="font-bold text-gray-900 text-base sm:text-lg">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-500 transition-transform duration-200 ${activeFAQ === index ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    {activeFAQ === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 sm:px-8 pb-5 sm:pb-6 text-gray-600 leading-relaxed text-base sm:text-lg"
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


      {/* CTA Section */}
      <section className="py-20 sm:py-24 bg-gradient-to-r from-rose-500 via-pink-600 to-purple-700 text-white relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-violet-400/20 to-purple-400/20 rounded-full blur-3xl"></div>


        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Start Bidding?
            </h2>
            <p className="text-lg sm:text-xl mb-8 sm:mb-10 text-rose-100 leading-relaxed max-w-2xl mx-auto">
              Join thousands of users and discover amazing deals on unique items
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-white to-gray-100 text-rose-600 hover:from-gray-100 hover:to-white text-base sm:text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold rounded-xl"
                asChild
              >
                <Link href="/auth">
                  Create Free Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="p-0 border-none bg-transparent">
                <Link
                  href="/dashboard"
                  className="border-2 border-white/30 text-white hover:bg-white hover:text-rose-600 text-base sm:text-lg px-8 py-6 h-auto backdrop-blur-md hover:border-white transition-all duration-300 font-bold rounded-xl flex items-center justify-center"
                >
                  Browse Auctions
                </Link>
              </Button>


            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
