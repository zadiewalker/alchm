"use client";

import { useEffect } from "react";

export function SessionKeepAlive() {
  useEffect(() => {
    const timer = setInterval(() => {
      fetch("/api/session/refresh", { method: "POST" }).catch(() => {
        // Silently handle refresh failures
      });
    }, 24 * 60 * 60 * 1000); // Once per day
    
    return () => clearInterval(timer);
  }, []);
  
  return null;
}