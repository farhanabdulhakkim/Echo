import React from 'react';
import { cn } from "@/lib/utils";

import Image from "next/image";

export function Logo({ iconOnly = false, className, iconClassName, textClassName }) {
  return (
    <div className={cn("flex items-center", className)}>
      <Image 
        src="/abstract-logo.png" 
        alt="Echo Logo" 
        width={180}
        height={50}
        className={cn("object-contain h-10 w-auto", iconClassName)}
      />
    </div>
  );
}
