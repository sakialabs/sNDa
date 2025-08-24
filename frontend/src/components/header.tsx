"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "./dark-mode-toggle";
import Link from "next/link";
import { Dialog } from "@/components/ui/dialog";
import { LoginFormContent } from "./login-form-content";
import { SignupFormContent } from "./signup-form-content";
import { useAuth } from "@/contexts/auth-context";
import type { User } from "../lib/types";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";

function getFullName(user: User | null) {
  if (!user) return "";
  return user.first_name && user.last_name
    ? `${user.first_name} ${user.last_name}`
    : user.username;
}

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    setShowLoginForm(false); // Reset login form state
    router.push("/");
  };

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const links = [
    { href: "/about", label: "About" },
    { href: "/community", label: "Community" },
    { href: "/contact", label: "Contact" },
    { href: "/donate", label: "Donate" },
    { href: "/volunteer", label: "Volunteer" },
    { href: "/wall-of-love", label: "Wall of Love" },
  ];

  return (
    <header className="sticky top-0 z-50">
      <div className="w-full px-4 py-2">
        <div className="w-full flex items-center gap-3">
          {/* Left: Brand in rounded capsule */}
          <motion.div
            className="flex items-center flex-1"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/"
              className="px-3 py-2 rounded-xl bg-card/80 border border-border backdrop-blur-sm shadow-sm text-card-foreground text-lg font-semibold"
            >
              sNDa 🥪
            </Link>
          </motion.div>

          {/* Center: Primary Nav pill */}
          <motion.nav
            className="hidden md:flex items-center justify-center gap-1 px-2 py-1 rounded-xl bg-card/80 text-card-foreground border border-border backdrop-blur-sm shadow-sm flex-1"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative text-sm font-medium transition-colors px-3 py-2 rounded-full ${
                    active ? "text-card-foreground" : "text-card-foreground/80 hover:text-card-foreground"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {l.label}
                </Link>
              );
            })}
          </motion.nav>

          {/* Right: Actions in rounded capsule */}
          <motion.div
            className="flex items-center justify-end flex-1"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Mobile burger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-1"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Actions group: Auth + Theme in same square */}
            <div className="flex items-center gap-2 px-2 py-1 rounded-xl bg-card/80 text-card-foreground border border-border backdrop-blur-sm shadow-sm">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt={getFullName(user)} />
                        <AvatarFallback>
                          {user?.first_name?.[0]}
                          {user?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{getFullName(user)}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/dashboard")}>My Cases</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/volunteer")}>Volunteer Hub</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/coordinator")}>Manage Cases</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/donate")}>Support Families</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="ghost" onClick={() => setShowLoginForm(true)} data-login size="sm">
                    Login
                  </Button>
                  <Button onClick={() => setShowSignupForm(true)} data-join-us size="sm">
                    Join Us
                  </Button>
                </div>
              )}
              <DarkModeToggle />
            </div>
          </motion.div>
        </div>
        {/* Mobile menu panel */}
        {mobileOpen && (
          <div className="md:hidden mt-2 rounded-xl border border-border bg-card/95 text-card-foreground backdrop-blur p-2 shadow-lg">
            <nav className="flex flex-col">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3 py-2 rounded-lg text-card-foreground/90 hover:bg-accent"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="flex gap-2 px-1 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setShowLoginForm(true);
                      setMobileOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setShowSignupForm(true);
                      setMobileOpen(false);
                    }}
                  >
                    Join Us
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>

      <Dialog open={showLoginForm} onOpenChange={setShowLoginForm}>
        <LoginFormContent onOpenChange={setShowLoginForm} />
      </Dialog>

      <Dialog open={showSignupForm} onOpenChange={setShowSignupForm}>
        <SignupFormContent onOpenChange={setShowSignupForm} />
      </Dialog>
    </header>
  );
}
