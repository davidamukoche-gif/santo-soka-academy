"use client";

import { X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { advertisements } from "@/lib/data";

export default function AdBanner() {
  const [visible, setVisible] = useState(true);
  const ad = advertisements[0];

  if (!visible || !ad) return null;

  return (
    <div className="relative rounded-lg overflow-hidden mb-8">
      <Link href={ad.targetUrl}>
        <div className="relative h-24 sm:h-32 bg-gradient-to-r from-[var(--primary)] to-purple-900">
          <div className="absolute inset-0 flex items-center justify-between px-6">
            <div>
              <p className="text-xs text-white/70 mb-1">Advertisement</p>
              <h3 className="text-lg sm:text-xl font-bold text-white">{ad.title}</h3>
              <p className="text-sm text-white/80 mt-1">Upgrade now and save big!</p>
            </div>
            <span className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hidden sm:block">
              Learn More
            </span>
          </div>
        </div>
      </Link>
      <button
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 bg-black/50 rounded-full p-1 hover:bg-black/80 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
