"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gavel,
  User,
  Search,
  Menu,
  X,
  LogOut,
  Settings,
  TrendingUp,
  Sparkles,
  Crown,
  Shield,
  Plus,
  Home,
  Activity,
  Heart,
  Wallet,
  HelpCircle,
  ChevronDown,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };


  const profileMenuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Activity },
    { href: "/profile", label: "My Profile", icon: User },
    { href: "/my-auctions", label: "My Auctions", icon: Gavel },
    { href: "/my-bids", label: "My Bids", icon: TrendingUp },

  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-2xl border-b border-gray-200/50"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3"
            >
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Gavel className="h-7 w-7 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="h-3 w-3 text-white" />
                  </motion.div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
                    BidZy
                  </h1>
                  <p className="text-xs text-gray-500 font-medium -mt-1">Premium Auctions</p>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
            </div>

            {/* Right Side - Search, Profile */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search auctions..."
                    className="pl-10 pr-4 py-2 w-80 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {isAuthenticated ? (
                <>
                  {/* Create Auction Button */}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => router.push("/create-auction")}
                      className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Create Auction</span>
                    </Button>
                  </motion.div>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        {user.userName ? user.userName.charAt(0).toUpperCase() : user.user_name ? user.user_name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="font-semibold text-sm text-gray-800">{user.userName || user.user_name}</p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Crown className="w-3 h-3 text-amber-500 mr-1" />
                          Premium
                        </p>
                      </div>
                      <ChevronDown
                        className={`hidden md:block h-4 w-4 text-gray-500 transition-transform ${
                          isProfileOpen ? "rotate-180" : ""
                        }`}
                      />
                    </motion.button>

                    {/* Profile Dropdown Menu */}
                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                        >
                          {/* Profile Header */}
                          <div className="p-6 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 border-b border-gray-100">
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-pink-400 via-rose-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                  {user.userName ? user.userName.charAt(0).toUpperCase() : user.user_name ? user.user_name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white"></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-gray-900 truncate">
                                  {user.userName || user.user_name}
                                </h3>
                                <p className="text-sm text-gray-600 truncate mb-2">{user.email}</p>
                                <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-full">
                                  <Zap className="h-3 w-3 text-yellow-600 mr-1.5" />
                                  <span className="text-xs text-yellow-700 font-semibold">
                                    Premium Member
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="py-3">
                            {profileMenuItems.map((item, index) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="group flex items-center space-x-4 px-6 py-3.5 text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:text-pink-600 transition-all duration-200"
                              >
                                <div className="w-9 h-9 bg-gray-100 group-hover:bg-pink-100 rounded-xl flex items-center justify-center transition-all duration-200">
                                  <item.icon className="h-5 w-5 text-gray-600 group-hover:text-pink-600 transition-colors duration-200" />
                                </div>
                                <div className="flex-1">
                                  <span className="font-semibold text-sm">{item.label}</span>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                                </div>
                              </Link>
                            ))}
                          </div>

                          {/* Sign Out Button */}
                          <div className="border-t border-gray-100 p-3">
                            <button
                              onClick={handleLogout}
                              className="group flex items-center space-x-4 w-full px-6 py-3.5 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 rounded-xl transition-all duration-200"
                            >
                              <div className="w-9 h-9 bg-red-100 group-hover:bg-red-200 rounded-xl flex items-center justify-center transition-all duration-200">
                                <LogOut className="h-5 w-5 text-red-600 transition-colors duration-200" />
                              </div>
                              <div className="flex-1">
                                <span className="font-semibold text-sm">Sign Out</span>
                              </div>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => router.push("/auth/login")}
                    className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Login / Register
                  </Button>
                </motion.div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300"
              >
                {isOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/95 backdrop-blur-lg"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
       
                
                <div className="border-t border-gray-200 my-2" />

                <Button
                  onClick={() => router.push("/create-auction")}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Auction</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-20" />
    </>
  );
};

export default Navbar; 