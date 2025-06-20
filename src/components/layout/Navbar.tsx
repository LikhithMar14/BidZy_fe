"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gavel,
  User,
  Search,
  Bell,
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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
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
    setIsNotificationsOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/auctions", label: "Auctions", icon: Gavel },
    { href: "/trending", label: "Trending", icon: TrendingUp },
    { href: "/help", label: "Help", icon: HelpCircle },
  ];

  const profileMenuItems = [
    { href: "/profile", label: "My Profile", icon: User },
    { href: "/my-auctions", label: "My Auctions", icon: Gavel },
    { href: "/my-bids", label: "My Bids", icon: Activity },
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/wallet", label: "Wallet", icon: Wallet },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const mockNotifications = [
    { id: 1, message: "You're winning the MacBook Pro auction!", time: "2m ago", type: "success" },
    { id: 2, message: "New bid placed on your iPhone 15", time: "5m ago", type: "info" },
    { id: 3, message: "Auction ending in 10 minutes", time: "8m ago", type: "warning" },
  ];


  console.log("USER IN NAVBAR", user)
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
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div key={item.href} className="relative">
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                        isActive
                          ? "text-pink-600 bg-gradient-to-r from-pink-50 to-rose-50"
                          : "text-gray-700 hover:text-pink-600 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavItem"
                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Right Side - Search, Notifications, Profile */}
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

                  {/* Notifications */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                      className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 relative"
                    >
                      <Bell className="h-6 w-6 text-gray-700" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        3
                      </span>
                    </motion.button>

                    {/* Notifications Dropdown */}
                    <AnimatePresence>
                      {isNotificationsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                        >
                          <div className="p-4 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                            {mockNotifications.map((notification) => (
                              <div
                                key={notification.id}
                                className="p-4 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-50 last:border-b-0"
                              >
                                <p className="text-sm text-gray-900 font-medium">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                              </div>
                            ))}
                          </div>
                          <div className="p-3 bg-gray-50">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                            >
                              View All Notifications
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-3 p-2 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 rounded-xl transition-all duration-300"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 via-rose-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                        {((user as any)?.user_name || user?.username || user?.email)?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-semibold text-gray-900">
                          {(user as any)?.user_name || user?.username || "User"}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Crown className="h-3 w-3 mr-1 text-yellow-500" />
                          Premium
                        </p>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${
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
                                  {((user as any)?.user_name || user?.username || user?.email)?.[0]?.toUpperCase() || "U"}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white"></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-gray-900 truncate">
                                  {(user as any)?.user_name || user?.username || "User"}
                                </h3>
                                <p className="text-sm text-gray-600 truncate mb-2">{user?.email}</p>
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
                /* Authentication Buttons */
                <div className="flex items-center space-x-4">
                  <Link href="/auth/login">
                    <Button
                      variant="ghost"
                      className="hidden sm:inline-flex text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-semibold"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        Get Started
                      </Button>
                    </motion.div>
                  </Link>
                </div>
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
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-gray-200 shadow-lg"
            >
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search auctions..."
                    className="pl-10 pr-4 py-3 w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                {/* Mobile Navigation Items */}
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                          isActive
                            ? "text-pink-600 bg-gradient-to-r from-pink-50 to-rose-50"
                            : "text-gray-700 hover:text-pink-600 hover:bg-gray-50"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Authentication/Profile */}
                {isAuthenticated ? (
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => router.push("/create-auction")}
                      className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create Auction
                    </Button>
                    
                    <div className="space-y-2">
                      {profileMenuItems.slice(0, 3).map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-pink-600 rounded-xl transition-all duration-200"
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <Link href="/auth/login" className="block">
                      <Button
                        variant="outline"
                        className="w-full border-2 border-pink-200 text-pink-600 hover:bg-pink-50 font-semibold py-3 rounded-xl"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup" className="block">
                      <Button className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
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