"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Heart, 
  CreditCard, 
  DollarSign, 
  Users, 
  Target,
  TrendingUp,
  Calendar,
  Gift,
  Star
} from "lucide-react";
import { toast } from "sonner";

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  donors: number;
  daysLeft: number;
  category: string;
  featured: boolean;
  image?: string;
}

interface DonationAmount {
  value: number;
  label: string;
  impact: string;
}

const DONATION_AMOUNTS: DonationAmount[] = [
  { value: 25, label: "$25", impact: "Provides basic medical supplies" },
  { value: 50, label: "$50", impact: "Covers transportation for one family" },
  { value: 100, label: "$100", impact: "Funds emergency assistance package" },
  { value: 250, label: "$250", impact: "Supports a family for one month" },
  { value: 500, label: "$500", impact: "Provides comprehensive care support" },
  { value: 1000, label: "$1000", impact: "Sponsors multiple families in need" }
];

export function DonationPlatform() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      title: 'Emergency Medical Fund',
      description: 'Supporting families facing unexpected medical emergencies with immediate financial assistance.',
      goal: 50000,
      raised: 32500,
      donors: 127,
      daysLeft: 15,
      category: 'Medical',
      featured: true
    },
    {
      id: '2',
      title: 'Transportation Support Program',
      description: 'Helping families get to medical appointments and essential services.',
      goal: 25000,
      raised: 18750,
      donors: 89,
      daysLeft: 22,
      category: 'Transportation',
      featured: false
    },
    {
      id: '3',
      title: 'Family Care Packages',
      description: 'Providing essential supplies and care packages to families in crisis.',
      goal: 15000,
      raised: 12300,
      donors: 156,
      daysLeft: 8,
      category: 'Support',
      featured: true
    }
  ]);

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recurringDonation, setRecurringDonation] = useState(false);

  const handleDonation = async () => {
    const amount = selectedAmount || parseFloat(customAmount);
    
    if (!amount || amount < 5) {
      toast.error("Minimum donation amount is $5");
      return;
    }

    if (!selectedCampaign) {
      toast.error("Please select a campaign to support");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update campaign with new donation
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === selectedCampaign 
          ? { 
              ...campaign, 
              raised: campaign.raised + amount,
              donors: campaign.donors + 1
            }
          : campaign
      ));

      toast.success(`Thank you for your ${recurringDonation ? 'monthly' : ''} donation of $${amount}!`);
      
      // Reset form
      setSelectedAmount(null);
      setCustomAmount('');
      setSelectedCampaign(null);
      setRecurringDonation(false);
      
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="text-center animate-fade-in">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Make a Difference Today
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your generosity directly supports families in need, providing essential care and hope during their most challenging times.
        </p>
      </div>

      {/* Impact Stats */}
      <div className="grid gap-4 md:grid-cols-4 animate-fade-in">
        <Card>
          <CardContent className="p-6 text-center">
            <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-sm text-muted-foreground">Families Helped</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">$485K</div>
            <p className="text-sm text-muted-foreground">Total Raised</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-sm text-muted-foreground">Active Donors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">94%</div>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold mb-6">Active Campaigns</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card 
              key={campaign.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedCampaign === campaign.id ? 'ring-2 ring-primary' : ''
              } ${campaign.featured ? 'border-primary' : ''}`}
              onClick={() => setSelectedCampaign(campaign.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant={campaign.featured ? "default" : "secondary"}>
                    {campaign.category}
                  </Badge>
                  {campaign.featured && <Star className="w-4 h-4 text-yellow-500" />}
                </div>
                <CardTitle className="text-lg">{campaign.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {campaign.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(getProgressPercentage(campaign.raised, campaign.goal))}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(campaign.raised, campaign.goal)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">{formatCurrency(campaign.raised)}</span>
                    <span className="text-muted-foreground">of {formatCurrency(campaign.goal)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {campaign.donors} donors
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {campaign.daysLeft} days left
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Donation Form */}
      {selectedCampaign && (
        <Card className="animate-slide-in-from-top">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Make Your Donation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preset Amounts */}
            <div>
              <Label className="text-base font-semibold">Choose Amount</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                {DONATION_AMOUNTS.map((amount) => (
                  <Button
                    key={amount.value}
                    variant={selectedAmount === amount.value ? "default" : "outline"}
                    className="h-auto p-4 flex flex-col items-center"
                    onClick={() => {
                      setSelectedAmount(amount.value);
                      setCustomAmount('');
                    }}
                  >
                    <span className="text-lg font-bold">{amount.label}</span>
                    <span className="text-xs text-center mt-1 opacity-75">
                      {amount.impact}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <Label htmlFor="custom-amount">Or Enter Custom Amount</Label>
              <div className="relative mt-2">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  className="pl-10"
                  min="5"
                  step="0.01"
                />
              </div>
            </div>

            {/* Recurring Donation */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="recurring"
                checked={recurringDonation}
                onChange={(e) => setRecurringDonation(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="recurring" className="text-sm">
                Make this a monthly recurring donation
              </Label>
            </div>

            {/* Payment Button */}
            <Button 
              onClick={handleDonation}
              disabled={isProcessing || (!selectedAmount && !customAmount)}
              className="w-full h-12 text-lg"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="loading-dots">Processing</div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Donate {selectedAmount ? formatCurrency(selectedAmount) : customAmount ? `$${customAmount}` : ''}
                  {recurringDonation && ' Monthly'}
                </div>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>🔒 Secure payment powered by Stripe</p>
              <p>Your donation is tax-deductible. Receipt will be emailed.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Donor Recognition */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Recent Supporters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Anonymous Donor", amount: 500, time: "2 hours ago" },
              { name: "Sarah M.", amount: 100, time: "5 hours ago" },
              { name: "Michael K.", amount: 250, time: "1 day ago" },
              { name: "Jennifer L.", amount: 75, time: "1 day ago" },
              { name: "Anonymous Donor", amount: 1000, time: "2 days ago" }
            ].map((donor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{donor.name}</p>
                    <p className="text-sm text-muted-foreground">{donor.time}</p>
                  </div>
                </div>
                <Badge variant="secondary">{formatCurrency(donor.amount)}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
