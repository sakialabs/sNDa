"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "./dark-mode-toggle";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "@/components/ui/dialog";
import { LoginFormContent } from "./login-form-content";
import { SignupFormContent } from "./signup-form-content";
import { useAuth } from "@/contexts/auth-context";
import type { User } from "../lib/types";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

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

  const handleLogout = () => {
    logout();
    setShowLoginForm(false); // Reset login form state
    router.push("/");
  };

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold text-foreground">
            sNDa 🥪
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/community" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Community
            </Link>
            <Link href="/donate" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Donate
            </Link>
            <Link href="/volunteer" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Volunteer
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt={getFullName(user)}
                    />
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
                    <p className="text-sm font-medium leading-none">
                      {getFullName(user)}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  My Cases
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/volunteer")}>
                  Volunteer Hub
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/coordinator")}>
                  Manage Cases
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/donate")}>
                  Support Families
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => setShowLoginForm(true)}
                data-login
              >
                Login
              </Button>
              <Button onClick={() => setShowSignupForm(true)} data-join-us>
                Join Us
              </Button>
            </div>
          )}
          <DarkModeToggle />
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
