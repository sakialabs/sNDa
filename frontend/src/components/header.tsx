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
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";
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
  const t = useTranslations();
  const locale = useLocale();
  const { user, isAuthenticated, logout } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLoginForm(false); // Reset login form state
    router.push(`/${locale}/`);
  };

  // Mobile menu state removed in favor of DropdownMenu popover

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { href: "/about", label: t("nav.about") },
    { href: "/community", label: t("nav.community") },
    { href: "/contact", label: t("nav.contact") },
    { href: "/donate", label: t("nav.donate") },
    { href: "/volunteer", label: t("nav.volunteer") },
    { href: "/wall-of-love", label: t("nav.wallOfLove") },
  ];

  const normalize = (p: string) => p.replace(/^\/(en|ar)(?=\/|$)/, "");

  const localePrefix = `/${locale}`;
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/80 border-b">
      <div className="w-full mx-auto px-4">
        <div className="h-14 flex items-center">
          {/* Left: Mobile menu button (md:hidden) + Logo */}
          <div className="flex items-center gap-2 md:flex-1">
            <div className="md:hidden">
              {mounted ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Open menu" className="size-9">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" sideOffset={8} className="w-64 p-1">
                    {links.map((l) => (
                      <DropdownMenuItem key={l.href} className="py-3 text-base" onClick={() => router.push(`${localePrefix}${l.href}`)}>
                        {l.label}
                      </DropdownMenuItem>
                    ))}
                    {!isAuthenticated && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="py-3 text-base" onClick={() => setShowLoginForm(true)}>{t("auth.login")}</DropdownMenuItem>
                        <DropdownMenuItem className="py-3 text-base" onClick={() => setShowSignupForm(true)}>{t("auth.joinUs")}</DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="icon" aria-label="Open menu" className="size-9 opacity-70">
                  <Menu className="h-5 w-5" />
                </Button>
              )}
            </div>

            <Link href={`${localePrefix}/`} className="inline-flex items-center gap-2">
              <Image src="/logo.png" alt="sNDa logo" width={24} height={24} className="h-6 w-6 object-contain" priority />
              <span className="text-base font-semibold leading-none">sNDa</span>
            </Link>
          </div>

          {/* Center: Primary Nav (md+) - Absolutely centered */}
          <nav className="hidden md:flex items-center justify-center gap-1 absolute left-1/2 transform -translate-x-1/2">
            {links.map((l) => {
              const current = normalize(pathname || "");
              const active = mounted && (current === l.href || current.startsWith(`${l.href}/`));
              return (
                <Link
                  key={l.href}
                  href={`${localePrefix}${l.href}`}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors hover:text-foreground ${
                    active ? "text-foreground" : "text-foreground/70"
                  }`}
                >
                  <span className="whitespace-nowrap">{l.label}</span>
                  {active && (
                    <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Language, Theme, Auth */}
          <div className="flex items-center gap-1 ml-auto md:flex-1 md:justify-end">
            <LanguageSwitcher />
            <DarkModeToggle />

            {mounted && isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
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
                  <DropdownMenuItem onClick={() => router.push(`/${locale}/dashboard`)}>My Cases</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/${locale}/volunteer`)}>Volunteer Hub</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/${locale}/coordinator`)}>Manage Cases</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/${locale}/donate`)}>Support Families</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/${locale}/profile`)}>Profile</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-1">
                <Button variant="ghost" onClick={() => setShowLoginForm(true)} data-login size="sm">
                  {t("auth.login")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  data-join-us
                  className="hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setShowSignupForm(true)}
                >
                  {t("auth.joinUs")}
                </Button>
              </div>
            )}
          </div>
        </div>
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
