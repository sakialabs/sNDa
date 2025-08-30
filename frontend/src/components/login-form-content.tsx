"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/auth-context";
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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { oauthService } from "@/lib/api/auth/oauth-service";
import { API_CONFIG } from "@/lib/api/config";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

interface LoginFormContentProps {
  onOpenChangeAction: (open: boolean) => void;
}

export function LoginFormContent({ onOpenChangeAction }: LoginFormContentProps) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [oauthConfig, setOauthConfig] = useState<{ google: boolean; facebook: boolean }>({ google: false, facebook: false });
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const isAR = locale === "ar";

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

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
      toast.error("Google sign-in is currently unavailable. Please try email login or contact support.");
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
      
      toast.success("Successfully signed in with Google!");
      onOpenChangeAction(false);
      router.push(`/${locale}/dashboard`);
    } catch (error) {
      console.error("Google login error:", error);
      const errorMessage = error instanceof Error ? error.message : "Google sign-in failed";
      
      // Show user-friendly message for configuration issues
      if (errorMessage.includes('not configured')) {
        toast.error("Google sign-in is currently unavailable. Please try email login or contact support.");
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
      toast.error("Facebook sign-in is currently unavailable. Please try email login or contact support.");
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
      
      toast.success("Successfully signed in with Facebook!");
      onOpenChangeAction(false);
      router.push(`/${locale}/dashboard`);
    } catch (error) {
      console.error("Facebook login error:", error);
      const errorMessage = error instanceof Error ? error.message : "Facebook sign-in failed";
      
      // Show user-friendly message for configuration issues
      if (errorMessage.includes('not configured')) {
        toast.error("Facebook sign-in is currently unavailable. Please try email login or contact support.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setFacebookLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      await login(data.identifier, data.password);
      onOpenChangeAction(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent 
      className="sm:max-w-[460px] p-0 overflow-hidden flex flex-col" 
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
            {t('auth.loginTitle')}
          </DialogTitle>
          <div className="w-12 h-px bg-primary mx-auto mt-2 mb-2"></div>
          <DialogDescription className="text-sm text-muted-foreground block mx-auto max-w-md leading-relaxed text-center" style={{textAlign: 'center', width: '100%'}}>
            {t('auth.loginDescription')}
          </DialogDescription>
        </div>
      </div>

      {/* Form Section */}
      <div className="p-8">
        {/* PREMIUM OAUTH BUTTONS */}
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
              {googleLoading ? "Signing in..." : !oauthConfig.google ? "Google sign-in unavailable" : "Continue with Google"}
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
              {facebookLoading ? "Signing in..." : !oauthConfig.facebook ? "Facebook sign-in unavailable" : "Continue with Facebook"}
            </span>
          </button>
        </div>
        
        {/* ELEGANT DIVIDER WITH APP COLORS */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone/30"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-card px-4">
              <span className="text-sm text-muted-foreground">
                {t('auth.orContinueWith')}
              </span>
            </div>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className={`text-sm font-medium ${isAR ? "text-right block font-cairo" : "text-left"}`}>
                    {t('auth.usernameOrEmail')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('auth.usernameOrEmailPlaceholder')}
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
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className={`text-sm font-medium ${isAR ? "text-right block font-cairo" : "text-left"}`}>
                    {t('auth.password')}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      {...field} 
                      disabled={isLoading}
                      placeholder={t('auth.passwordPlaceholder')}
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
            
            <Button 
              type="submit" 
              className={`w-full h-11 mt-6 ${
                isAR ? "font-cairo" : ""
              }`} 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className={`flex items-center ${isAR ? "flex-row-reverse gap-2" : "flex-row gap-2"}`}>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t('auth.loggingIn')}</span>
                </div>
              ) : (
                <span>{t('auth.login')}</span>
              )}
            </Button>

            <div className="pt-4 border-t">
              <p className={`text-sm text-muted-foreground text-center ${isAR ? "font-cairo" : ""}`}>
                <span>{t('auth.newToSanda')} </span>
                <button 
                  type="button" 
                  className="text-primary hover:underline font-medium" 
                  onClick={() => {
                    onOpenChangeAction(false);
                    const signupButton = document.querySelector("[data-signup]");
                    if (signupButton) {
                      (signupButton as HTMLButtonElement).click();
                    }
                  }}
                >
                  {t('auth.signupHere')}
                </button>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
}
