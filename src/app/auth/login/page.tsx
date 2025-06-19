'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { LoginForm } from '@/components/auth/LoginForm'
import { Shield, Users, Zap, Star, CheckCircle, Gavel, TrendingUp, Clock, DollarSign } from 'lucide-react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  const benefits = [
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "Bank-level security with encrypted transactions and verified sellers",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Users,
      title: "Global Community",
      description: "Join thousands of bidders from around the world in our vibrant auction community",
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: Zap,
      title: "Instant Access",
      description: "Start bidding immediately after registration with our streamlined process",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Gavel,
      title: "Live Bidding",
      description: "Experience the thrill of real-time auctions with instant bid updates",
      color: "from-rose-500 to-pink-600",
    },
    {
      icon: Clock,
      title: "24/7 Auctions",
      description: "Never miss an auction with our round-the-clock bidding platform",
      color: "from-rose-500 to-red-600",
    },
    {
      icon: TrendingUp,
      title: "Best Deals",
      description: "Find unique items at competitive prices with our smart bidding system",
      color: "from-cyan-500 to-sky-600",
    },
  ]

  const stats = [
    { number: "10K+", label: "Active Users", icon: Users },
    { number: "50K+", label: "Auctions Completed", icon: Gavel },
    { number: "$2M+", label: "Total Value", icon: DollarSign },
    { number: "99.9%", label: "Satisfaction Rate", icon: Star },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Art Collector",
      avatar: "SJ",
      content: "BidZy has transformed how I collect art. The live bidding experience is incredible and I've found some amazing pieces.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Antique Dealer",
      avatar: "MC",
      content: "As a seller, I love the global reach BidZy provides. My items get more exposure and better prices than ever before.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-black/10 z-0"></div>
      <div className="absolute inset-0 opacity-30 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 2px, transparent 2px)`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-violet-400/20 to-purple-400/20 rounded-full blur-3xl z-0"></div>

      <div className="flex min-h-screen relative z-10 ">
        {/* Left Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-start justify-center p-4 lg:p-8 ">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-20 h-20 bg-gradient-to-r from-white to-gray-100 rounded-2xl flex items-center justify-center mb-6 shadow-2xl"
              >
                <span className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">B</span>
              </motion.div>
              <h1 className="text-4xl font-bold text-white mb-2">Welcome to BidZy</h1>
              <p className="text-rose-100 text-lg">
                {isLogin ? 'Sign in to your account' : 'Create your account'}
              </p>
            </motion.div>

            <LoginForm />
          </div>
        </div>

        {/* Right Side - Benefits & Info */}
        <div className="hidden lg:flex lg:w-1/2 text-white relative">
          <div className="relative z-10 flex flex-col justify-center px-12 py-16 w-full">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-full flex flex-col justify-center"
            >
              <div className="mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-white/15 backdrop-blur-md rounded-full text-sm font-medium border border-white/20 mb-6">
                  <Star className="w-4 h-4 mr-2 text-amber-300" />
                  Trusted by 10,000+ users worldwide
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  Join the Ultimate
                  <span className="block bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                    Auction Experience
                  </span>
                </h2>
                <p className="text-xl text-rose-100 leading-relaxed">
                  Experience real-time bidding, secure transactions, and access to unique items from around the world.
                </p>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="grid grid-cols-2 gap-6 mb-12"
              >
                {stats.map((stat, index) => (
                  <div key={stat.label} className="text-center group">
                    <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-rose-200 text-sm font-medium">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-6 mb-12">
                {benefits.slice(0, 4).map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className={`w-10 h-10 bg-gradient-to-r ${benefit.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <benefit.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold mb-1 text-white">{benefit.title}</h3>
                      <p className="text-xs text-rose-200 leading-relaxed">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Testimonials */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="space-y-4 mb-8"
              >
                {testimonials.map((testimonial, index) => (
                  <div key={testimonial.name} className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
                    <div className="flex items-center mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-300 fill-current" />
                      ))}
                    </div>
                    <p className="text-rose-100 italic mb-3 text-sm leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-sm mr-3 shadow-lg">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                        <div className="text-xs text-rose-200">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="pt-6 border-t border-white/20"
              >
                <div className="flex flex-wrap items-center gap-4 text-sm text-rose-100">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    <span className="font-medium">No registration fees</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    <span className="font-medium">Secure payments</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    <span className="font-medium">24/7 support</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}