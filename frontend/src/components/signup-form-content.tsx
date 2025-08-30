"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Heart, Users, Star } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { oauthService } from "@/lib/api/auth/oauth-service";
import { API_CONFIG } from "@/lib/api/config";
import { useRouter } from "next/navigation";

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

interface SignupFormContentProps {
  onOpenChangeAction: (open: boolean) => void;
}

const roleOptions = [
  {
    value: "VOLUNTEER",
    labelKey: "signup.roles.volunteer.label",
    descKey: "signup.roles.volunteer.desc",
    icon: Heart,
    color: "text-primary",
  },
  {
    value: "COORDINATOR",
    labelKey: "signup.roles.coordinator.label",
    descKey: "signup.roles.coordinator.desc",
    icon: Users,
    color: "text-primary",
  },
  {
    value: "DONOR",
    labelKey: "signup.roles.donor.label",
    descKey: "signup.roles.donor.desc",
    icon: Star,
    color: "text-primary",
  },
];

export function SignupFormContent({ onOpenChangeAction }: SignupFormContentProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const isAR = locale === "ar";
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [oauthConfig, setOauthConfig] = useState<{ google: boolean; facebook: boolean }>({ google: false, facebook: false });
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Check OAuth configuration on mount
  useEffect(() => {
    const checkOAuthConfig = async () => {
      try {
        const config = await oauthService.getOAuthConfig();
        setOauthConfig({
          google: !!config.google?.client_id,
          facebook: !!config.facebook?.app_id
        });
      } catch (error) {
        console.log("OAuth configuration check failed:", error);
        setOauthConfig({ google: false, facebook: false });
      }
    };
    
    checkOAuthConfig();
  }, []);

  // Google OAuth Handler
  const handleGoogleOAuth = async () => {
    if (!oauthConfig.google) {
      toast.error("Google sign-in is currently unavailable. Please try email registration or contact support.");
      return;
    }
    
    try {
      setGoogleLoading(true);
      const response = await oauthService.signInWithGoogle();
      
      // Store tokens
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, response.access);
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, response.refresh);
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER, JSON.stringify(response.user));
      
      // Set cookies for middleware
      document.cookie = `${API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN}=${response.access}; Max-Age=3600; path=/`;
      document.cookie = `${API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN}=${response.refresh}; Max-Age=604800; path=/`;
      
      toast.success("Successfully signed up with Google!");
      onOpenChangeAction(false);
      router.push(`/${locale}/dashboard`);
    } catch (error) {
      console.error("Google signup error:", error);
      const errorMessage = error instanceof Error ? error.message : "Google sign-up failed";
      
      // Show user-friendly message for configuration issues
      if (errorMessage.includes('not configured')) {
        toast.error("Google sign-in is currently unavailable. Please try email registration or contact support.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // Facebook OAuth Handler  
  const handleFacebookOAuth = async () => {
    if (!oauthConfig.facebook) {
      toast.error("Facebook sign-in is currently unavailable. Please try email registration or contact support.");
      return;
    }
    
    try {
      setFacebookLoading(true);
      const response = await oauthService.signInWithFacebook();
      
      // Store tokens
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, response.access);
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, response.refresh);
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER, JSON.stringify(response.user));
      
      // Set cookies for middleware
      document.cookie = `${API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN}=${response.access}; Max-Age=3600; path=/`;
      document.cookie = `${API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN}=${response.refresh}; Max-Age=604800; path=/`;
      
      toast.success("Successfully signed up with Facebook!");
      onOpenChangeAction(false);
      router.push(`/${locale}/dashboard`);
    } catch (error) {
      console.error("Facebook signup error:", error);
      const errorMessage = error instanceof Error ? error.message : "Facebook sign-up failed";
      
      // Show user-friendly message for configuration issues
      if (errorMessage.includes('not configured')) {
        toast.error("Facebook sign-in is currently unavailable. Please try email registration or contact support.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setFacebookLoading(false);
    }
  };

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

  toast.success(t("signup.toast.success"));
  onOpenChangeAction(false);

      // TODO: Auto-login after signup
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("signup.toast.error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent 
      className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto p-0 gap-0 flex flex-col" 
      dir={isAR ? "rtl" : "ltr"}
    >
        {/* Header Section */}
        <div className="w-full flex flex-col items-center justify-center p-8 pb-6 space-y-4 border-b bg-muted/30">
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
          <div className="w-full flex flex-col items-center justify-center text-center space-y-2">
            <DialogTitle className={`text-2xl font-bold tracking-tight text-center mx-auto ${isAR ? "font-cairo" : ""}`} style={{textAlign: 'center', width: '100%'}}>
              {t("signup.title")}
            </DialogTitle>
            <div className="w-12 h-px bg-primary mx-auto"></div>
            <DialogDescription className={`text-sm text-muted-foreground text-center mx-auto max-w-md leading-relaxed ${isAR ? "font-cairo" : ""}`} style={{textAlign: 'center', width: '100%'}}>
              {t("signup.subtitle")}
            </DialogDescription>
          </div>
        </div>
        
        {/* TODO: Social Authentication Section */}
        {/* ================================== */}
        {/* 🚀 COMING SOON: One-click signup with social providers */}
        <div className="px-6 pb-4">
          <div className="space-y-3">
            {/* Placeholder for social login buttons */}
            <div className="grid gap-2">
              {/* 
              TODO: Add these beautiful social login buttons:
              
              <SocialAuthButton provider="google" className="w-full">
                <GoogleIcon className="h-5 w-5" />
                Continue with Google
              </SocialAuthButton>
              
              <SocialAuthButton provider="facebook" className="w-full">
                <FacebookIcon className="h-5 w-5" />
                Continue with Facebook
              </SocialAuthButton>
              
              <SocialAuthButton provider="github" className="w-full">
                <GitHubIcon className="h-5 w-5" />
                Continue with GitHub
              </SocialAuthButton>
              */}
            </div>
            
            {/* Elegant divider */}
            {/* 
            TODO: Add this beautiful divider:
            
            <div className="flex items-center gap-4 py-4">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-sm text-muted-foreground font-medium">
                or continue with email
              </span>
              <div className="flex-1 h-px bg-border"></div>
            </div>
            */}
          </div>
        </div>
        {/* ================================== */}
        
      {/* Form Section */}
      <div className="p-6" style={{ direction: isAR ? 'rtl' : 'ltr' }}>
        {/* CLEAN OAUTH BUTTONS WITH APP COLORS */}
        <div className="space-y-4 mb-10">
          <button 
            type="button"
            disabled={googleLoading || facebookLoading || isLoading || !oauthConfig.google}
            className="relative w-full h-14 flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl text-gray-700 transition-colors duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleGoogleOAuth()}
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span className="text-base">
              {googleLoading ? "Signing up..." : !oauthConfig.google ? "Google sign-up unavailable" : "Continue with Google"}
            </span>
          </button>
          
          <button 
            type="button"
            disabled={googleLoading || facebookLoading || isLoading || !oauthConfig.facebook}
            className="relative w-full h-14 flex items-center justify-center space-x-3 bg-[#1877F2] hover:bg-[#166FE5] border border-[#1877F2]/20 text-white rounded-xl transition-colors duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleFacebookOAuth()}
          >
            {facebookLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            )}
            <span className="text-base">
              {facebookLoading ? "Signing up..." : !oauthConfig.facebook ? "Facebook sign-up unavailable" : "Continue with Facebook"}
            </span>
          </button>
        </div>
        
        {/* ELEGANT DIVIDER WITH APP COLORS */}
        <div className="relative mb-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone/30"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-card px-4">
              <span className="text-sm text-muted-foreground">
                {t('auth.orSignupWithEmail')}
              </span>
            </div>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-3">
              <FormLabel className={`text-base font-semibold ${isAR ? "text-right block font-cairo" : "text-left"}`}>
                {t("signup.howHelp")}
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
                      className={`h-auto p-6 flex items-start gap-3 transition-all duration-150 w-full ${
                        isAR ? "text-right" : "text-left"
                      }`}
                      onClick={() => {
                        setSelectedRole(role.value);
                        form.setValue("role", role.value as FormData["role"]);
                      }}
                    >
                      <Icon className="h-6 w-6 mt-1 flex-shrink-0" />
                      <div className={`flex-1 min-w-0 ${isAR ? "text-right" : "text-left"}`}>
                        <h3 className={`font-semibold ${isAR ? "text-right font-cairo" : "text-left"}`}>
                          {t(role.labelKey)}
                        </h3>
                        <p className={`text-sm opacity-80 mt-1 ${isAR ? "text-right" : "text-left"}`}>
                          {t(role.descKey)}
                        </p>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>          {/* Personal Information */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className={`text-sm font-medium ${isAR ? "text-right block font-cairo" : "text-left"}`}>
                    {t("signup.fields.firstName.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("signup.fields.firstName.placeholder")}
                      {...field}
                      disabled={isLoading}
                      className={`h-11 ${
                        isAR 
                          ? "text-right placeholder:text-right pr-3 pl-3 font-cairo" 
                          : "text-left placeholder:text-left"
                      }`}
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
                  <FormLabel className={`text-sm font-medium ${isAR ? "text-right block font-cairo" : "text-left"}`}>
                    {t("signup.fields.lastName.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("signup.fields.lastName.placeholder")}
                      {...field}
                      disabled={isLoading}
                      className={`h-11 ${
                        isAR 
                          ? "text-right placeholder:text-right pr-3 pl-3 font-cairo" 
                          : "text-left placeholder:text-left"
                      }`}
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
                <FormLabel className={`text-sm font-medium ${isAR ? "text-right block font-cairo" : "text-left"}`}>
                  {t("signup.fields.username.label")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("signup.fields.username.placeholder")}
                    {...field}
                    disabled={isLoading}
                    className={`h-11 ${
                      isAR 
                        ? "text-right placeholder:text-right pr-3 pl-3 font-cairo" 
                        : "text-left placeholder:text-left"
                    }`}
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
                <FormLabel className={`text-sm font-medium ${isAR ? "text-right block font-cairo" : "text-left"}`}>
                  {t("signup.fields.email.label")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("signup.fields.email.placeholder")}
                    {...field}
                    disabled={isLoading}
                    className={`h-11 ${
                      isAR 
                        ? "text-right placeholder:text-right pr-3 pl-3 font-cairo" 
                        : "text-left placeholder:text-left"
                    }`}
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
                  <FormLabel className={`text-sm font-medium ${isAR ? "text-right block font-cairo" : "text-left"}`}>
                    {t("signup.fields.password.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("signup.fields.password.placeholder")}
                      {...field}
                      disabled={isLoading}
                      className={`h-11 ${
                        isAR 
                          ? "text-right placeholder:text-right pr-3 pl-3 font-cairo" 
                          : "text-left placeholder:text-left"
                      }`}
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
                  <FormLabel className={`text-sm font-medium ${isAR ? "text-right block font-cairo" : "text-left"}`}>
                    {t("signup.fields.confirmPassword.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("signup.fields.confirmPassword.placeholder")}
                      {...field}
                      disabled={isLoading}
                      className={`h-11 ${
                        isAR 
                          ? "text-right placeholder:text-right pr-3 pl-3 font-cairo" 
                          : "text-left placeholder:text-left"
                      }`}
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
            <div className="flex items-start gap-3">
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
                  {t("signup.agreeToTermsPrefix")} {" "}
                  <a
                    href={`/${locale}/terms`}
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("signup.termsOfService")}
                  </a>
                </label>
                <p className={`text-xs text-muted-foreground ${isAR ? "text-right" : "text-left"}`}>
                  {t("signup.agreeToTermsDesc")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
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
                  {t("signup.agreeToPrivacyPrefix")} {" "}
                  <a
                    href={`/${locale}/privacy`}
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("signup.privacyPolicy")}
                  </a>
                </label>
                <p className={`text-xs text-muted-foreground ${isAR ? "text-right" : "text-left"}`}>
                  {t("signup.agreeToPrivacyDesc")}
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className={`w-full h-11 mt-6 ${
              isAR ? "font-cairo" : ""
            }`}
            disabled={isLoading || !selectedRole}
          >
            {isLoading ? (
              <div className={`flex items-center ${isAR ? "flex-row-reverse gap-2" : "flex-row gap-2"}`}>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("signup.button.creating")}</span>
              </div>
            ) : (
              <span>{t("signup.button.join")}</span>
            )}
          </Button>

          <div className="pt-4 border-t">
            <p className={`text-sm text-muted-foreground text-center ${isAR ? "font-cairo" : ""}`}>
              <span>{t("signup.alreadyHaveAccountPrefix")} </span>
              <button
                type="button"
                className="text-primary hover:underline font-medium"
                onClick={() => {
                  onOpenChangeAction(false);
                  // Trigger login form to open
                  const loginButton = document.querySelector("[data-login]");
                  if (loginButton) {
                    (loginButton as HTMLButtonElement).click();
                  }
                }}
              >
                {t("signup.signInHere")}
              </button>
            </p>
          </div>
        </form>
      </Form>
      </div>
    </DialogContent>
  );
}
