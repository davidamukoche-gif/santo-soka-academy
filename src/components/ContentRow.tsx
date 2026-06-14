"use client";

import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface ContentRowProps {
  title: string;
  icon?: ReactNode;
  href?: string;
  children: ReactNode;
}

export default function ContentRow({ title, icon, href, children }: ContentRowProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          {icon}
          {title}
        </h2>
        {href && (
          <Link href={href} className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div className="scroll-container flex gap-4 pb-2">
        {children}
      </div>
    </section>
  );
}
