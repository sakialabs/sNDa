import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🥪</span>
            <span className="text-lg font-semibold">sNDa</span>
            <span className="text-sm text-muted-foreground">
              Solidarity Network for Development & Action
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <a
              href="mailto:snda@hey.me"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>
        </div>

        <div className="mt-2 pt-2">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-xs text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} sNDa. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground text-center md:text-right flex items-center">
              Made with 💖 for children in need
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
