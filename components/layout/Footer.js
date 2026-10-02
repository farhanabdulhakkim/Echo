import React from "react";
import Link from "next/link";
import { BRAND } from "@/data/brand";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
        {BRAND.footerLinks.map((item) => (
          <Link key={item.label} href={item.href}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            {item.label}
          </Link>
        ))}
      </div>
      <hr className="border-gray-200 dark:border-gray-600 my-3" />
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>© {new Date().getFullYear()} {BRAND.name}</span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}
