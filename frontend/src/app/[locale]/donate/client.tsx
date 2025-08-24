"use client";

import { DonationPlatform } from "@/components/donor/donation-platform";

export default function DonateClient() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 py-8">
        <DonationPlatform />
      </div>
    </div>
  );
}
