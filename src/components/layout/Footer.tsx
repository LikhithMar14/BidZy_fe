"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Gavel,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Heart,
  Shield,
  Award,
  Zap,
  Crown,
  Sparkles,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Platform",
      links: [
        { href: "/auctions", label: "Browse Auctions" },
        { href: "/trending", label: "Trending Items" },
        { href: "/create-auction", label: "Sell Your Items" },
        { href: "/how-it-works", label: "How It Works" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "/help", label: "Help Center" },
        { href: "/contact", label: "Contact Us" },
        { href: "/safety", label: "Safety Guidelines" },
        { href: "/dispute", label: "Dispute Resolution" },
      ],
    },
    {
      title: "Community",
      links: [
        { href: "/blog", label: "Blog" },
        { href: "/success-stories", label: "Success Stories" },
        { href: "/testimonials", label: "Testimonials" },
        { href: "/affiliate", label: "Affiliate Program" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/terms", label: "Terms of Service" },
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/cookies", label: "Cookie Policy" },
        { href: "/licenses", label: "Licenses" },
      ],
    },
  ];

  const socialLinks = [
    { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
    { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
    { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
    { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
    { href: "https://youtube.com", icon: Youtube, label: "YouTube" },
  ];

  const features = [
    { icon: Shield, text: "Secure Transactions" },
    { icon: Award, text: "Verified Sellers" },
    { icon: Zap, text: "Instant Bidding" },
    { icon: Crown, text: "Premium Support" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          <defs>
            <pattern id="footerGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#footerGrid)" />
        </svg>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => {
          // Use deterministic positioning based on index to avoid hydration mismatch
          const positions = [
            { left: 15, top: 20 },
            { left: 85, top: 40 },
            { left: 25, top: 70 },
            { left: 75, top: 15 },
            { left: 45, top: 85 },
            { left: 65, top: 30 },
            { left: 35, top: 60 },
            { left: 55, top: 45 },
          ];
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
              style={{
                left: `${positions[i].left}%`,
                top: `${positions[i].top}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          );
        })}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="py-16 border-b border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Gavel className="h-9 w-9 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="h-4 w-4 text-white" />
                  </motion.div>
                </div>
                <div>
                  <h2 className="text-4xl font-black bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent">
                    BidZy
                  </h2>
                  <p className="text-gray-300 font-medium">Premium Auctions Platform</p>
                </div>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-md">
                The world's most trusted auction platform where buyers and sellers connect 
                to discover amazing deals on unique items.
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
                  >
                    <feature.icon className="h-5 w-5 text-pink-400" />
                    <span className="text-sm font-medium text-gray-200">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Newsletter Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Stay in the Loop</h3>
              <p className="text-gray-300 mb-6">
                Get notified about exclusive auctions, special deals, and platform updates.
              </p>
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Subscribe
                  </motion.button>
                </div>
                <p className="text-xs text-gray-400">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {footerSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-bold text-white mb-6">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-pink-400 transition-colors duration-200 text-sm font-medium"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="py-8 border-t border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left"
          >
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <Mail className="h-5 w-5 text-pink-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Email us</p>
                <p className="text-white font-medium">support@bidzy.com</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Phone className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Call us</p>
                <p className="text-white font-medium">1-800-BIDZY-NOW</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="p-2 bg-rose-500/20 rounded-lg">
                <MapPin className="h-5 w-5 text-rose-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Visit us</p>
                <p className="text-white font-medium">San Francisco, CA</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2 text-gray-400"
            >
              <span>© {currentYear} BidZy. Made with</span>
              <Heart className="h-4 w-4 text-pink-500 fill-current" />
              <span>for auction enthusiasts.</span>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center space-x-4"
            >
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 group"
                >
                  <social.icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 