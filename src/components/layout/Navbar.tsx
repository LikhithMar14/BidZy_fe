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
  Plus,
  Activity,
  Wallet,
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
    { href: "/wallet", label: "Wallet", icon: Wallet },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 bg-gradient-to-br from-slate-50 via-white to-pink-50 shadow-md border-b border-pink-200"
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
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Gavel className="h-7 w-7 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <Sparkles className="h-3 w-3 text-gray-900" />
                  </motion.div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-black bg-gradient-to-r from-pink-500 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                    BidZy
                  </h1>
                  <p className="text-xs text-gray-600 font-medium -mt-1">
                    Premium Auctions
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* <Link
                href="/auctions"
                className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-200"
              >
                Live Auctions
              </Link>
              <Link
                href="/categories"
                className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-200"
              >
                Categories
              </Link>
              <Link
                href="/how-it-works"
                className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-200"
              >
                How It Works
              </Link>
              <Link
                href="/about"
                className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-200"
              >
                About
              </Link> */}
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
                    className="pl-10 pr-4 py-2 w-80 bg-white border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>

              {isAuthenticated ? (
                <>
                  {/* Create Auction Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => router.push("/create-auction")}
                      className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-gray-900 font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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
                      className="flex items-center space-x-2 p-2 bg-white hover:bg-pink-50 rounded-xl transition-all duration-300 border border-pink-200"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        {user?.userName
                          ? user.userName.charAt(0).toUpperCase()
                          : user?.user_name
                          ? user.user_name.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="font-semibold text-sm text-white">
                          {user?.userName || user?.user_name}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center">
                          <Crown className="w-3 h-3 text-amber-400 mr-1" />
                          Premium
                        </p>
                      </div>
                      <ChevronDown
                        className={`hidden md:block h-4 w-4 text-gray-400 transition-transform ${
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
                          className="absolute right-0 mt-3 w-72 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden"
                        >
                          {/* Profile Header */}
                          <div className="p-6 bg-gradient-to-br from-emerald-900/20 via-green-900/20 to-teal-900/20 border-b border-gray-700">
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                  {user?.userName
                                    ? user.userName.charAt(0).toUpperCase()
                                    : user?.user_name
                                    ? user.user_name.charAt(0).toUpperCase()
                                    : "U"}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-gray-900"></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-white truncate">
                                  {user?.userName || user?.user_name}
                                </h3>
                                <p className="text-sm text-gray-400 truncate mb-2">
                                  {user?.email}
                                </p>
                                <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full border border-amber-500/30">
                                  <Zap className="h-3 w-3 text-amber-400 mr-1.5" />
                                  <span className="text-xs text-amber-300 font-semibold">
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
                                className="group flex items-center space-x-4 px-6 py-3.5 text-gray-300 hover:bg-gradient-to-r hover:from-emerald-900/30 hover:to-green-900/30 hover:text-emerald-300 transition-all duration-200"
                              >
                                <div className="w-9 h-9 bg-gray-800 group-hover:bg-emerald-800/50 rounded-xl flex items-center justify-center transition-all duration-200">
                                  <item.icon className="h-5 w-5 text-gray-400 group-hover:text-emerald-400 transition-colors duration-200" />
                                </div>
                                <div className="flex-1">
                                  <span className="font-semibold text-sm">
                                    {item.label}
                                  </span>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                </div>
                              </Link>
                            ))}
                          </div>

                          {/* Sign Out Button */}
                          <div className="border-t border-gray-700 p-3">
                            <button
                              onClick={handleLogout}
                              className="group flex items-center space-x-4 w-full px-6 py-3.5 text-red-400 hover:bg-gradient-to-r hover:from-red-900/30 hover:to-rose-900/30 rounded-xl transition-all duration-200"
                            >
                              <div className="w-9 h-9 bg-red-900/50 group-hover:bg-red-800/50 rounded-xl flex items-center justify-center transition-all duration-200">
                                <LogOut className="h-5 w-5 text-red-400 transition-colors duration-200" />
                              </div>
                              <div className="flex-1">
                                <span className="font-semibold text-sm">
                                  Sign Out
                                </span>
                              </div>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => router.push("/auth/login")}
                    className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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
                className="lg:hidden p-2 bg-white hover:bg-pink-50 rounded-xl transition-all duration-300 border border-pink-200"
              >
                {isOpen ? (
                  <X className="h-6 w-6 text-gray-600" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600" />
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
              className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-pink-200"
            >
              <div className="px-4 pt-4 pb-6 space-y-4">
                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  <Link
                    href="/auctions"
                    className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl font-medium transition-all duration-200"
                  >
                    Live Auctions
                  </Link>
                  <Link
                    href="/categories"
                    className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl font-medium transition-all duration-200"
                  >
                    Categories
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl font-medium transition-all duration-200"
                  >
                    How It Works
                  </Link>
                  <Link
                    href="/about"
                    className="block px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl font-medium transition-all duration-200"
                  >
                    About
                  </Link>
                </div>

                {/* Mobile Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search auctions..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 text-gray-800 placeholder-gray-400"
                  />
                </div>

                {isAuthenticated && (
                  <>
                    <div className="border-t border-gray-800 pt-4" />
                    <Button
                      onClick={() => router.push("/create-auction")}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-gray-900 font-bold px-6 py-3 rounded-xl shadow-lg"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Create Auction</span>
                    </Button>

                    {/* Mobile Profile Menu */}
                    <div className="space-y-2">
                      {profileMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-emerald-400 hover:bg-gray-800/50 rounded-xl transition-all duration-200"
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-xl transition-all duration-200"
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-24" />
    </>
  );
};

export default Navbar;
