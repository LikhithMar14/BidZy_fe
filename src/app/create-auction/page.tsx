"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { 
  Upload, 
  Calendar, 
  DollarSign, 
  Clock, 
  Tag, 
  FileText, 
  Image as ImageIcon,
  X,
  Plus,
  Gavel,
  ArrowLeft,
  Sparkles,
  Star,
  Zap,
  CheckCircle,
  Timer
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { createAuction, getImageUploadUrl, uploadImageToS3 } from "@/connecting/auction";
import { Category, Status, type CreateAuctionRequest } from "@/types/auction";
import { useAuth } from "@/hooks/useAuth";

const createAuctionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startingPrice: z.number().min(0.01, "Starting price must be greater than 0"),
  increment: z.number().min(0.01, "Increment must be greater than 0"),
  categoryIds: z.array(z.number()).min(1, "Please select at least one category"),
  startDateTime: z.string().min(1, "Start date and time is required"),
  endDateTime: z.string().min(1, "End date and time is required"),
}).refine((data) => {
  const startDate = new Date(data.startDateTime);
  const endDate = new Date(data.endDateTime);
  return endDate > startDate;
}, {
  message: "End date must be after start date",
  path: ["endDateTime"],
});

type CreateAuctionForm = z.infer<typeof createAuctionSchema>;

const categories = [
  { id: Category.ART, name: "Art", icon: "🎨", gradient: "from-rose-500 to-pink-600" },
  { id: Category.COLLECTIBLES, name: "Collectibles", icon: "🏆", gradient: "from-amber-500 to-orange-600" },
  { id: Category.ELECTRONICS, name: "Electronics", icon: "📱", gradient: "from-violet-500 to-purple-600" },
  { id: Category.FASHION, name: "Fashion", icon: "👗", gradient: "from-emerald-500 to-teal-600" },
  { id: Category.HOME, name: "Home", icon: "🏠", gradient: "from-blue-500 to-cyan-600" },
  { id: Category.OTHER, name: "Other", icon: "📦", gradient: "from-gray-500 to-slate-600" },
];

export default function CreateAuctionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedDuration, setCalculatedDuration] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateAuctionForm>({
    resolver: zodResolver(createAuctionSchema),
    defaultValues: {
      title: "",
      description: "",
      startingPrice: 0,
      increment: 1,
      categoryIds: [],
      startDateTime: "",
      endDateTime: "",
    },
  });

  // Watch for date changes to calculate duration automatically
  const startDateTime = form.watch("startDateTime");
  const endDateTime = form.watch("endDateTime");

  useEffect(() => {
    if (startDateTime && endDateTime) {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      const diffInMs = end.getTime() - start.getTime();
      
      if (diffInMs > 0) {
        const diffInHours = Math.round(diffInMs / (1000 * 60 * 60));
        const days = Math.floor(diffInHours / 24);
        const hours = diffInHours % 24;
        
        if (days > 0) {
          setCalculatedDuration(`${days} day${days > 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`);
        } else {
          setCalculatedDuration(`${hours} hour${hours !== 1 ? 's' : ''}`);
        }
      } else {
        setCalculatedDuration("");
      }
    } else {
      setCalculatedDuration("");
    }
  }, [startDateTime, endDateTime]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("Image size must be less than 10MB");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleCategory = (categoryId: number) => {
    const updatedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(updatedCategories);
    form.setValue('categoryIds', updatedCategories);
  };

  const onSubmit = async (data: CreateAuctionForm) => {
    if (!user?.id) {
      toast.error("Please log in to create an auction");
      return;
    }

    if (!selectedFile) {
      toast.error("Please upload an image for your auction");
      return;
    }

    setIsSubmitting(true);

    try {
      const startDateUTC = new Date(data.startDateTime).toISOString().replace(/\.\d{3}Z$/, 'Z');
      const endDateUTC = new Date(data.endDateTime).toISOString().replace(/\.\d{3}Z$/, 'Z');
      
      const durationInHours = Math.round((new Date(endDateUTC).getTime() - new Date(startDateUTC).getTime()) / (1000 * 60 * 60));

      const tempAuctionId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const uploadResponse = await getImageUploadUrl({
        fileName: selectedFile.name,
        contentType: selectedFile.type,
        auctionId: tempAuctionId,
      });


      await uploadImageToS3(uploadResponse.data.uploadUrl, selectedFile);

      const auctionData: CreateAuctionRequest = {
        title: data.title,
        description: data.description,
        startingPrice: data.startingPrice,
        increment: data.increment,
        duration: durationInHours,
        userId: user.id,
        image: uploadResponse.data.imageUrl,
        categoryIds: data.categoryIds,
        startDateTime: startDateUTC,
        endDateTime: endDateUTC,
        status: Status.INACTIVE,
      };


      await createAuction(auctionData);
      
      toast.success("Auction created successfully!", {
        description: "Your auction is now live and accepting bids!"
      });
      router.push("/"); 
    } catch (error: any) {
      console.error("Error creating auction:", error);
      toast.error(error.message || "Failed to create auction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 opacity-20">
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

      <div className="relative container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            
            <motion.div 
              className="flex items-center gap-4 mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <div className="p-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20">
                  <Gavel className="w-8 h-8 text-white" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="h-4 w-4 text-white" />
                </motion.div>
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Create New
                  <span className="block bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                    Auction
                  </span>
                </h1>
                <p className="text-rose-100 text-lg sm:text-xl mt-2">
                  Share your treasures with bidders worldwide
                </p>
              </div>
            </motion.div>

            {/* Trust indicators */}
            <motion.div 
              className="flex flex-wrap items-center gap-6 text-sm text-white/90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span className="font-medium">Secure S3 uploads</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span className="font-medium">Real-time bidding</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span className="font-medium">Global reach</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                          <CardTitle className="flex items-center gap-3 text-2xl">
                            <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            Basic Information
                          </CardTitle>
                          <CardDescription className="text-base">
                            Provide the essential details about your auction item
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-lg font-semibold text-gray-900">Auction Title</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter a compelling title for your auction"
                                    className="h-12 text-base border-2 focus:border-rose-500 rounded-xl"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription className="text-base">
                                  Make it descriptive and appealing to potential bidders
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-lg font-semibold text-gray-900">Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Describe your item in detail - condition, history, special features..."
                                    className="min-h-[140px] text-base border-2 focus:border-rose-500 rounded-xl"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription className="text-base">
                                  Include all relevant details that bidders should know
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Categories */}
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                          <CardTitle className="flex items-center gap-3 text-2xl">
                            <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl">
                              <Tag className="w-6 h-6 text-white" />
                            </div>
                            Categories
                          </CardTitle>
                          <CardDescription className="text-base">
                            Select categories that best describe your item
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {categories.map((category) => (
                              <motion.button
                                key={category.id}
                                type="button"
                                onClick={() => toggleCategory(category.id)}
                                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                                  selectedCategories.includes(category.id)
                                    ? `border-transparent shadow-xl bg-gradient-to-r ${category.gradient} text-white scale-105`
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white'
                                }`}
                                whileHover={{ scale: selectedCategories.includes(category.id) ? 1.05 : 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {selectedCategories.includes(category.id) && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                                  >
                                    <CheckCircle className="w-5 h-5 text-white" />
                                  </motion.div>
                                )}
                                <div className="text-3xl mb-3">{category.icon}</div>
                                <div className="font-semibold text-base">{category.name}</div>
                              </motion.button>
                            ))}
                          </div>
                          {form.formState.errors.categoryIds && (
                            <p className="text-red-500 text-sm mt-4 font-medium">
                              {form.formState.errors.categoryIds.message}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Pricing & Timing */}
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                          <CardTitle className="flex items-center gap-3 text-2xl">
                            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                              <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            Pricing & Timing
                          </CardTitle>
                          <CardDescription className="text-base">
                            Set your auction parameters
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="startingPrice"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-lg font-semibold text-gray-900">Starting Price ($)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number"
                                      step="0.01"
                                      min="0.01"
                                      placeholder="0.00"
                                      className="h-12 text-base border-2 focus:border-rose-500 rounded-xl"
                                      {...field}
                                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="increment"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-lg font-semibold text-gray-900">Bid Increment ($)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number"
                                      step="0.01"
                                      min="0.01"
                                      placeholder="1.00"
                                      className="h-12 text-base border-2 focus:border-rose-500 rounded-xl"
                                      {...field}
                                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="startDateTime"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-lg font-semibold text-gray-900">Start Date & Time</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="datetime-local"
                                      className="h-12 text-base border-2 focus:border-rose-500 rounded-xl"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    When should the auction start?
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="endDateTime"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-lg font-semibold text-gray-900">End Date & Time</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="datetime-local"
                                      className="h-12 text-base border-2 focus:border-rose-500 rounded-xl"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    When should the auction end?
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Duration Display */}
                          {calculatedDuration && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                                  <Timer className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">Auction Duration</p>
                                  <p className="text-blue-700 font-bold text-lg">{calculatedDuration}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Image Upload */}
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                          <CardTitle className="flex items-center gap-3 text-xl">
                            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl">
                              <ImageIcon className="w-5 h-5 text-white" />
                            </div>
                            Auction Image
                          </CardTitle>
                          <CardDescription>
                            Upload a high-quality image of your item
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            {imagePreview ? (
                              <motion.div 
                                className="relative"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                              >
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-full h-56 object-cover rounded-xl border-2 border-gray-200 shadow-lg"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-3 right-3 rounded-full shadow-lg"
                                  onClick={removeImage}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            ) : (
                              <motion.div
                                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-rose-400 hover:bg-rose-50/50 transition-all duration-300"
                                onClick={() => fileInputRef.current?.click()}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                  <Upload className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-gray-700 font-medium mb-2">
                                  Click to upload or drag and drop
                                </p>
                                <p className="text-sm text-gray-500">
                                  PNG, JPG, JPEG up to 10MB
                                </p>
                              </motion.div>
                            )}
                            
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full h-12 text-base border-2 rounded-xl hover:bg-gray-50"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              {imagePreview ? 'Change Image' : 'Upload Image'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden">
                        <CardContent className="p-6">
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              type="submit"
                              className="w-full h-16 text-lg bg-gradient-to-r from-rose-500 via-pink-600 to-purple-700 hover:from-rose-600 hover:via-pink-700 hover:to-purple-800 text-white font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <div className="flex items-center gap-3">
                                  <motion.div 
                                    className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  />
                                  Creating Auction...
                                </div>
                              ) : (
                                <div className="flex items-center gap-3">
                                  <Gavel className="w-6 h-6" />
                                  Create Auction
                                  <Sparkles className="w-5 h-5" />
                                </div>
                              )}
                            </Button>
                          </motion.div>
                          <p className="text-sm text-gray-500 text-center mt-4">
                            By creating this auction, you agree to our terms and conditions
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </div>
              </form>
            </Form>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating animated elements */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-20 w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-2xl"
      >
        <Star className="w-10 h-10 text-amber-800" />
      </motion.div>

      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 left-20 w-16 h-16 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full flex items-center justify-center shadow-2xl"
      >
        <Zap className="w-8 h-8 text-violet-800" />
      </motion.div>
    </div>
  );
} 