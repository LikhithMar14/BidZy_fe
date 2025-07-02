"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const ConditionalFooter = () => {
  const pathname = usePathname();
  
  // Pages where footer should not be shown
  const excludeFooterPaths = [
    "/auth/login",
    "/auth/signup", 
    "/auth/callback",
    "/auth/reset-password",
    "/auth/verify-email",
    "/dashboard",
    "/create-auction",
    "/auction/:id",
    "/auction/"
  ];

  const shouldShowFooter = !excludeFooterPaths.some(path => pathname.startsWith(path));

  if (!shouldShowFooter) {
    return null;
  }

  return <Footer />;
};

export default ConditionalFooter; 