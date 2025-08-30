"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/auth-context";
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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";

const formSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

interface LoginFormProps {
  isOpen: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export function LoginForm({ isOpen, onOpenChangeAction }: LoginFormProps) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations();
  const locale = useLocale();
  const isAR = locale === "ar";

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

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

  // Handle dialog close
  const handleOpenChange = (open: boolean) => {
    onOpenChangeAction(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
          <div className={`w-full text-center ${isAR ? "font-cairo" : ""}`}>
            <DialogTitle className="text-2xl font-bold tracking-tight block mx-auto">
              {t('auth.loginTitle')}
            </DialogTitle>
            <div className="w-12 h-px bg-primary mx-auto mt-2 mb-2"></div>
            <DialogDescription className="text-sm text-muted-foreground block mx-auto max-w-md leading-relaxed">
              {t('auth.loginDescription')}
            </DialogDescription>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
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

              {/* Social Login Section */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      {t('auth.orContinueWith')}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
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
                      <span className="bg-background px-2 text-muted-foreground">or</span>
                    </div>
                  </div>
                </div>
              </div>

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
    </Dialog>
  );
}
