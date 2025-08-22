"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
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
import { Loader2, Heart, Users, Shield, Star } from "lucide-react";
import { motion } from "framer-motion";

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
  onOpenChange: (open: boolean) => void;
}

const roleOptions = [
  {
    value: "VOLUNTEER",
    label: "Volunteer",
    description:
      "Help children directly by taking on cases and providing support",
    icon: Heart,
    color: "text-red-500",
  },
  {
    value: "COORDINATOR",
    label: "Coordinator",
    description: "Manage cases, assign volunteers, and oversee operations",
    icon: Users,
    color: "text-blue-500",
  },
  {
    value: "DONOR",
    label: "Donor",
    description: "Support our mission through financial contributions",
    icon: Star,
    color: "text-yellow-500",
  },
];

export function SignupFormContent({ onOpenChange }: SignupFormContentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");

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

      toast.success(
        "Welcome to sNDa! Your account has been created successfully."
      );
      onOpenChange(false);

      // TODO: Auto-login after signup
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create account"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center mb-4"
        >
          <div className="bg-primary/10 p-3 rounded-full text-3xl">🥪</div>
        </motion.div>
        <DialogTitle className="text-2xl font-bold">
          Join Our Community of Care
        </DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Every person has a role to play in helping children in need. Choose
          how you'd like to contribute.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <FormLabel className="text-base font-semibold">
              How would you like to help?
            </FormLabel>
            <div className="grid gap-3">
              {roleOptions.map((role) => {
                const Icon = role.icon;
                return (
                  <motion.div
                    key={role.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedRole === role.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => {
                        setSelectedRole(role.value);
                        form.setValue("role", role.value as any);
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className={`h-6 w-6 mt-1 ${role.color}`} />
                        <div className="flex-1">
                          <h3 className="font-semibold">{role.label}</h3>
                          <p className="text-sm text-muted-foreground">
                            {role.description}
                          </p>
                        </div>
                        {selectedRole === role.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-primary text-primary-foreground rounded-full p-1"
                          >
                            <Shield className="h-4 w-4" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
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
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your first name"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your last name"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Choose a unique username"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Create a strong password"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Terms and Privacy */}
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={form.watch("agreeToTerms")}
                onCheckedChange={(checked) =>
                  form.setValue("agreeToTerms", checked as boolean)
                }
                disabled={isLoading}
              />
              <div className="space-y-1">
                <label htmlFor="terms" className="text-sm font-medium">
                  I agree to the{" "}
                  <a
                    href="/terms"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Service
                  </a>
                </label>
                <p className="text-xs text-muted-foreground">
                  By checking this box, you agree to our terms of service and
                  community guidelines.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="privacy"
                checked={form.watch("agreeToPrivacy")}
                onCheckedChange={(checked) =>
                  form.setValue("agreeToPrivacy", checked as boolean)
                }
                disabled={isLoading}
              />
              <div className="space-y-1">
                <label htmlFor="privacy" className="text-sm font-medium">
                  I agree to the{" "}
                  <a
                    href="/privacy"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                </label>
                <p className="text-xs text-muted-foreground">
                  I understand how my data will be used and protected according
                  to our privacy policy.
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !selectedRole}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating your account...
              </>
            ) : (
              "Join sNDa Community"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => {
                onOpenChange(false);
                // Trigger login form to open
                const loginButton = document.querySelector("[data-login]");
                if (loginButton) {
                  (loginButton as HTMLButtonElement).click();
                }
              }}
            >
              Sign in here
            </button>
          </p>
        </form>
      </Form>
    </DialogContent>
  );
}
