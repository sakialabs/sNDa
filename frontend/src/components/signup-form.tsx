"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// Select component not used in this form
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Heart, Users, Star } from "lucide-react";
import Image from "next/image";

const formSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    role: z.enum(["VOLUNTEER", "COORDINATOR", "DONOR"]),
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, "You must agree to the terms"),
    agreeToPrivacy: z
      .boolean()
      .refine((val) => val === true, "You must agree to the privacy policy"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

interface SignupFormProps {
  isOpen: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

const roleOptions = [
  {
    value: "VOLUNTEER",
    label: "Volunteer",
    description:
      "Help children directly by taking on cases and providing support",
    icon: Heart,
    color: "text-primary",
  },
  {
    value: "COORDINATOR",
    label: "Coordinator",
    description: "Manage cases, assign volunteers, and oversee operations",
    icon: Users,
    color: "text-primary",
  },
  {
    value: "DONOR",
    label: "Donor",
    description: "Support our mission through financial contributions",
    icon: Star,
    color: "text-primary",
  },
];

export function SignupForm({ isOpen, onOpenChangeAction }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const t = useTranslations();
  const locale = useLocale();
  const isAR = locale === "ar";

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      role: "VOLUNTEER",
      agreeToTerms: false,
      agreeToPrivacy: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      // TODO: Implement signup API call
      const response = await fetch("/api/auth/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

  if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create account");
      }
  toast.success(t('signup.toast.success'));
  onOpenChangeAction(false);

      // TODO: Auto-login after signup
    } catch (error) {
  toast.error(error instanceof Error ? error.message : t('signup.toast.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChangeAction}>
      <DialogContent 
        className="sm:max-w-[720px] max-h-[95vh] overflow-y-auto p-0 gap-0 flex flex-col" 
        dir={isAR ? "rtl" : "ltr"}
      >
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center w-full p-8 pb-6 space-y-4 border-b bg-muted/30">
          <div className="relative flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full">
            <Image
              src="/logo.png"
              alt="sNDa"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
          <div className={`w-full text-center flex flex-col items-center justify-center ${isAR ? "font-cairo" : ""}`}>
            <DialogTitle className="text-2xl font-bold tracking-tight block mx-auto text-center" style={{textAlign: 'center', width: '100%'}}>
              {t('signup.title')}
            </DialogTitle>
            <div className="w-12 h-px bg-primary mx-auto mt-2 mb-2"></div>
            <DialogDescription className="text-sm text-muted-foreground block mx-auto max-w-md leading-relaxed text-center" style={{textAlign: 'center', width: '100%'}}>
              {t('signup.subtitle')}
            </DialogDescription>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {/* Social Login Section */}
          <div className="mb-6">
            {/* DIRECT HARDCODED OAUTH BUTTONS - NO BULLSHIT */}
            <div className="space-y-3">
              <button 
                type="button"
                className="w-full h-12 flex items-center justify-center space-x-3 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                onClick={() => alert('Google OAuth clicked!')}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
              
              <button 
                type="button"
                className="w-full h-12 flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
                onClick={() => alert('Facebook OAuth clicked!')}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Continue with Facebook</span>
              </button>
            </div>
            
            <div className="relative mt-6 mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t('auth.orSignupWithEmail')}
                </span>
              </div>
            </div>
          </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            {/* Role Selection */}
            <div className="space-y-4">
              <FormLabel className={`text-base font-semibold block ${isAR ? "text-right font-cairo" : "text-left"}`}>
                {t('signup.howHelp')}
              </FormLabel>
              <div className="grid gap-3">
                {roleOptions.map((role) => {
                  const Icon = role.icon;
                  return (
                    <Button
                      key={role.value}
                      type="button"
                      size="lg"
                      variant={selectedRole === role.value ? "default" : "outline"}
                      className={`h-auto p-6 flex items-start gap-3 text-left transition-all duration-150 ${
                        isAR ? "flex-row-reverse" : "flex-row"
                      }`}
                      onClick={() => {
                        setSelectedRole(role.value);
                        form.setValue("role", role.value as FormData["role"]);
                      }}
                    >
                      <Icon className="h-6 w-6 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold ${isAR ? "text-right font-cairo" : "text-left"}`}>
                          {t(`signup.roles.${role.value.toLowerCase()}.label`)}
                        </h3>
                        <p className={`text-sm opacity-80 mt-1 ${isAR ? "text-right" : "text-left"}`}>
                          {t(`signup.roles.${role.value.toLowerCase()}.desc`)}
                        </p>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className={`text-sm font-medium block ${isAR ? "text-right font-cairo" : "text-left"}`}>
                      {t('auth.firstName')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('auth.firstNamePlaceholder')}
                        {...field}
                        disabled={isLoading}
                        className={`h-11 transition-all duration-200 ${
                          isAR 
                            ? "text-right placeholder:text-right pr-4 pl-4 font-cairo" 
                            : "text-left placeholder:text-left"
                        } focus:ring-2 focus:ring-primary/20 border-input hover:border-primary/50`}
                        dir={isAR ? "rtl" : "ltr"}
                      />
                    </FormControl>
                    <FormMessage className={isAR ? "text-right" : "text-left"} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className={`text-sm font-medium block ${isAR ? "text-right font-cairo" : "text-left"}`}>
                      {t('auth.lastName')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('auth.lastNamePlaceholder')}
                        {...field}
                        disabled={isLoading}
                        className={`h-11 transition-all duration-200 ${
                          isAR 
                            ? "text-right placeholder:text-right pr-4 pl-4 font-cairo" 
                            : "text-left placeholder:text-left"
                        } focus:ring-2 focus:ring-primary/20 border-input hover:border-primary/50`}
                        dir={isAR ? "rtl" : "ltr"}
                      />
                    </FormControl>
                    <FormMessage className={isAR ? "text-right" : "text-left"} />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className={`text-sm font-medium block ${isAR ? "text-right font-cairo" : "text-left"}`}>
                    {t('auth.username')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('auth.usernamePlaceholder')}
                      {...field}
                      disabled={isLoading}
                      className={`h-11 transition-all duration-200 ${
                        isAR 
                          ? "text-right placeholder:text-right pr-4 pl-4 font-cairo" 
                          : "text-left placeholder:text-left"
                      } focus:ring-2 focus:ring-primary/20 border-input hover:border-primary/50`}
                      dir={isAR ? "rtl" : "ltr"}
                    />
                  </FormControl>
                  <FormMessage className={isAR ? "text-right" : "text-left"} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className={`text-sm font-medium block ${isAR ? "text-right font-cairo" : "text-left"}`}>
                    {t('auth.email')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t('auth.emailPlaceholder')}
                      {...field}
                      disabled={isLoading}
                      className={`h-11 transition-all duration-200 ${
                        isAR 
                          ? "text-right placeholder:text-right pr-4 pl-4 font-cairo" 
                          : "text-left placeholder:text-left"
                      } focus:ring-2 focus:ring-primary/20 border-input hover:border-primary/50`}
                      dir={isAR ? "rtl" : "ltr"}
                    />
                  </FormControl>
                  <FormMessage className={isAR ? "text-right" : "text-left"} />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className={`text-sm font-medium block ${isAR ? "text-right font-cairo" : "text-left"}`}>
                      {t('auth.password')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t('auth.passwordPlaceholder')}
                        {...field}
                        disabled={isLoading}
                        className={`h-11 transition-all duration-200 ${
                          isAR 
                            ? "text-right placeholder:text-right pr-4 pl-4 font-cairo" 
                            : "text-left placeholder:text-left"
                        } focus:ring-2 focus:ring-primary/20 border-input hover:border-primary/50`}
                        dir={isAR ? "rtl" : "ltr"}
                      />
                    </FormControl>
                    <FormMessage className={isAR ? "text-right" : "text-left"} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className={`text-sm font-medium block ${isAR ? "text-right font-cairo" : "text-left"}`}>
                      {t('auth.confirmPassword')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t('auth.confirmPasswordPlaceholder')}
                        {...field}
                        disabled={isLoading}
                        className={`h-11 transition-all duration-200 ${
                          isAR 
                            ? "text-right placeholder:text-right pr-4 pl-4 font-cairo" 
                            : "text-left placeholder:text-left"
                        } focus:ring-2 focus:ring-primary/20 border-input hover:border-primary/50`}
                        dir={isAR ? "rtl" : "ltr"}
                      />
                    </FormControl>
                    <FormMessage className={isAR ? "text-right" : "text-left"} />
                  </FormItem>
                )}
              />
            </div>

            {/* Terms and Privacy */}
            <div className={`space-y-4 ${isAR ? "text-right" : "text-left"}`}>
              <div className={`flex items-start gap-3 w-full ${isAR ? "flex-row-reverse justify-end" : "flex-row justify-start"}`}>
                <Checkbox
                  id="terms"
                  checked={form.watch("agreeToTerms")}
                  onCheckedChange={(checked) =>
                    form.setValue("agreeToTerms", checked as boolean)
                  }
                  disabled={isLoading}
                  className="mt-1 flex-shrink-0"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <label 
                    htmlFor="terms" 
                    className={`text-sm font-medium cursor-pointer block ${isAR ? "text-right font-cairo" : "text-left"}`}
                  >
                    {t('auth.agreeToTerms')}
                  </label>
                </div>
              </div>

              <div className={`flex items-start gap-3 w-full ${isAR ? "flex-row-reverse justify-end" : "flex-row justify-start"}`}>
                <Checkbox
                  id="privacy"
                  checked={form.watch("agreeToPrivacy")}
                  onCheckedChange={(checked) =>
                    form.setValue("agreeToPrivacy", checked as boolean)
                  }
                  disabled={isLoading}
                  className="mt-1 flex-shrink-0"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <label 
                    htmlFor="privacy" 
                    className={`text-sm font-medium cursor-pointer block ${isAR ? "text-right font-cairo" : "text-left"}`}
                  >
                    {t('auth.agreeToPrivacy')}
                  </label>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className={`w-full h-11 mt-6 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                isAR ? "font-cairo" : ""
              }`} 
              disabled={isLoading || !selectedRole}
            >
              {isLoading ? (
                <div className={`flex items-center ${isAR ? "flex-row-reverse" : "flex-row"}`}>
                  <Loader2 className={`h-4 w-4 animate-spin ${isAR ? "ml-2" : "mr-2"}`} />
                  <span>{t('auth.creatingAccount')}</span>
                </div>
              ) : (
                <span>{t('auth.createAccount')}</span>
              )}
            </Button>

            <p className={`text-xs text-muted-foreground ${isAR ? "text-right" : "text-center"}`}>
              <span>{t('signup.alreadyHaveAccountPrefix')} </span>
              <button 
                type="button" 
                className="text-primary hover:underline font-medium transition-colors" 
                onClick={() => {
                  onOpenChangeAction(false);
                  // Trigger login form to open
                  const loginButton = document.querySelector("[data-login]");
                  if (loginButton) {
                    (loginButton as HTMLButtonElement).click();
                  }
                }}
              >
                {t('signup.signInHere')}
              </button>
            </p>
          </form>
        </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
