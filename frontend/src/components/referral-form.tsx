import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { API_CONFIG } from "@/lib/api/config";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle, AlertCircle } from "lucide-react";

export const ReferralForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const childName = (
      form.elements.namedItem("child-name") as HTMLInputElement
    )?.value.trim();
    const location = (
      form.elements.namedItem("location") as HTMLInputElement
    )?.value.trim();
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    )?.value.trim();

    // Enhanced validation
    if (!childName) {
      toast.error("Child name is required");
      return;
    }
    if (!description) {
      toast.error("Please add a brief description");
      return;
    }
    if (!consentGiven) {
      toast.error("Please provide consent to proceed");
      return;
    }
    if (description.length < 20) {
      toast.error("Description must be at least 20 characters long");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/intake/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          child_name: childName,
          location,
          description,
          consent: consentGiven,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to submit referral");
      }

      const result = await res.json();
      setCaseId(result.id || "REF-" + Date.now());
      setSuccess(true);
      form.reset();
      setConsentGiven(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit referral"
      );
    } finally {
      setLoading(false);
    }
  }

  const handleReset = () => {
    setSuccess(false);
    setCaseId(null);
    setConsentGiven(false);
  };
  return (
    <>
      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-600">
              Referral Submitted Successfully!
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Thank you for helping a child in need. Our team will review your
              referral and take appropriate action.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Case ID:</strong> {caseId}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Please save this ID for future reference
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={handleReset} className="w-full" variant="outline">
              Submit Another Referral
            </Button>
            <p className="text-xs text-muted-foreground">
              You can close this window now
            </p>
          </div>
        </motion.div>
      ) : (
        <>
          <DialogHeader className="text-center">
            <DialogTitle className="text-3xl font-bold text-primary">
              Help is a Few Clicks Away
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-2">
              Every child deserves care. If you know a child in need, please
              share their story with us.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-6 pt-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="child-name" className="font-semibold">
                Child&apos;s Full Name *
              </Label>
              <Input
                id="child-name"
                name="child-name"
                placeholder="Adila Malik"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="font-semibold">
                Location (City, Neighborhood)
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="Al-Amarat, Khartoum"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="font-semibold">
                Brief Description of Need *
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Please describe the child's situation and the specific help they need. Include details about their age, family situation, and urgent needs..."
                rows={5}
                required
              />
              <p className="text-xs text-muted-foreground">
                Minimum 20 characters required
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consent"
                  checked={consentGiven}
                  onCheckedChange={(checked) =>
                    setConsentGiven(checked as boolean)
                  }
                  className="mt-1"
                />
                <div className="space-y-1">
                  <Label htmlFor="consent" className="text-sm font-medium">
                    I provide consent to share this information
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    By checking this box, you confirm that you have permission
                    to share this child's information and that you understand
                    this data will be used to provide assistance.
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full font-bold text-base"
              disabled={loading || !consentGiven}
            >
              {loading ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="inline-flex items-center gap-2"
                >
                  <span className="h-3 w-3 rounded-full bg-current animate-pulse" />
                  Sending…
                </motion.span>
              ) : (
                "Send Referral"
              )}
            </Button>
          </form>
        </>
      )}
    </>
  );
};
