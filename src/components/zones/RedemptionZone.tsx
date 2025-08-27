import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Coins, Gift, Trophy, Star, Crown, Sparkles, ShoppingBag, ArrowRight, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

interface RedemptionZoneProps {
  totalCoins: number;
  onCoinsUpdate: (newTotal: number) => void;
}

interface RedemptionTier {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  minCoins: number;
  icon: any;
  color: string;
  bgGradient: string;
}

const redemptionTiers: RedemptionTier[] = [
  {
    id: "bronze",
    name: "Bronze Achievement",
    description: "A great start to your learning journey!",
    benefits: [
      "Certificate of Achievement",
      "Motivational message from Jesi",
      "Study tips collection",
      "Fun learning facts"
    ],
    minCoins: 100,
    icon: Star,
    color: "text-amber-600",
    bgGradient: "from-amber-100 to-amber-200"
  },
  {
    id: "silver",
    name: "Silver Excellence",
    description: "Outstanding dedication to learning!",
    benefits: [
      "Silver Certificate with your name",
      "Personal study session with Jesi (30 mins)",
      "Exclusive learning resources",
      "Progress milestone badge",
      "Custom motivational playlist"
    ],
    minCoins: 250,
    icon: Trophy,
    color: "text-gray-600",
    bgGradient: "from-gray-100 to-gray-200"
  },
  {
    id: "gold",
    name: "Gold Mastery",
    description: "Exceptional learning achievement!",
    benefits: [
      "Gold Certificate of Excellence",
      "Extended Jesi mentoring session (1 hour)",
      "Access to advanced learning modules",
      "Special recognition badge",
      "Learning strategy consultation",
      "Priority support access"
    ],
    minCoins: 500,
    icon: Crown,
    color: "text-yellow-600",
    bgGradient: "from-yellow-100 to-yellow-200"
  },
  {
    id: "platinum",
    name: "Platinum Scholar",
    description: "The ultimate learning achievement!",
    benefits: [
      "Platinum Scholar Certificate",
      "Premium Jesi mentoring package (3 sessions)",
      "Exclusive scholar resources library",
      "Master learner recognition",
      "Custom learning path design",
      "VIP support access",
      "Learning achievement showcase"
    ],
    minCoins: 1000,
    icon: Sparkles,
    color: "text-purple-600",
    bgGradient: "from-purple-100 to-purple-200"
  }
];

export function RedemptionZone({ totalCoins, onCoinsUpdate }: RedemptionZoneProps) {
  const [selectedTier, setSelectedTier] = useState<RedemptionTier | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [redeemedTiers, setRedeemedTiers] = useState<string[]>([]);
  const { toast } = useToast();

  const getAvailableTiers = () => {
    return redemptionTiers.filter(tier => 
      totalCoins >= tier.minCoins && !redeemedTiers.includes(tier.id)
    );
  };

  const getUpcomingTiers = () => {
    return redemptionTiers.filter(tier => 
      totalCoins < tier.minCoins && !redeemedTiers.includes(tier.id)
    );
  };

  const triggerSuccessConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF8C00', '#87CEEB', '#98FB98']
    });
  };

  const handleRedeem = (tier: RedemptionTier) => {
    setSelectedTier(tier);
    setShowConfirmDialog(true);
  };

  const confirmRedemption = () => {
    if (selectedTier) {
      // Redeem ALL coins for the reward
      onCoinsUpdate(0);
      setRedeemedTiers([...redeemedTiers, selectedTier.id]);
      
      triggerSuccessConfetti();
      toast({
        title: `🎉 ${selectedTier.name} Unlocked!`,
        description: `Congratulations! You've redeemed ${totalCoins} coins for ${selectedTier.name}!`,
      });
      
      setShowConfirmDialog(false);
      setSelectedTier(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
          <ShoppingBag className="w-10 h-10" />
          Coin Redemption Center
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Redeem all your coins for amazing achievement rewards!
        </p>
        
        {/* Current Coins Display */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-6 rounded-2xl inline-block mb-8">
          <div className="flex items-center gap-3">
            <Coins className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90">Your Total Balance</p>
              <p className="text-3xl font-bold">{totalCoins} Coins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Redemptions */}
      {getAvailableTiers().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Available to Redeem Now!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getAvailableTiers().map((tier) => {
                const IconComponent = tier.icon;
                return (
                  <Card key={tier.id} className={`bg-gradient-to-br ${tier.bgGradient} border-2 hover-lift cursor-pointer transition-all duration-300 hover:shadow-lg`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                            <IconComponent className={`w-6 h-6 ${tier.color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{tier.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{tier.description}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-500 text-white">
                          Ready!
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <p className="font-semibold text-gray-700">What you'll get:</p>
                        <ul className="space-y-1">
                          {tier.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins className="w-5 h-5 text-yellow-500" />
                          <span className="font-bold">Costs all {totalCoins} coins</span>
                        </div>
                        
                        <Button
                          onClick={() => handleRedeem(tier)}
                          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                        >
                          Redeem Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Rewards */}
      {getUpcomingTiers().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Keep Learning to Unlock!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getUpcomingTiers().map((tier) => {
                const IconComponent = tier.icon;
                const coinsNeeded = tier.minCoins - totalCoins;
                
                return (
                  <Card key={tier.id} className={`bg-gradient-to-br ${tier.bgGradient} opacity-60 border-2 border-dashed`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                            <IconComponent className={`w-6 h-6 ${tier.color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{tier.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{tier.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          Need {coinsNeeded} more coins
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <p className="font-semibold text-gray-700">What you'll get:</p>
                        <ul className="space-y-1">
                          {tier.benefits.slice(0, 3).map((benefit, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                          {tier.benefits.length > 3 && (
                            <li className="text-sm text-gray-500">+ {tier.benefits.length - 3} more benefits...</li>
                          )}
                        </ul>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins className="w-5 h-5 text-yellow-500" />
                          <span className="font-bold">Requires {tier.minCoins} coins</span>
                        </div>
                        
                        <Button disabled variant="outline">
                          Keep Learning!
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Already Redeemed */}
      {redeemedTiers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-purple-600">Your Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {redemptionTiers
                .filter(tier => redeemedTiers.includes(tier.id))
                .map((tier) => {
                  const IconComponent = tier.icon;
                  return (
                    <div key={tier.id} className={`bg-gradient-to-br ${tier.bgGradient} p-4 rounded-lg border-2 border-green-300`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
                          <IconComponent className={`w-5 h-5 ${tier.color}`} />
                        </div>
                        <div>
                          <p className="font-bold">{tier.name}</p>
                          <p className="text-sm text-green-600">✅ Redeemed</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No coins message */}
      {totalCoins === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Coins className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No Coins to Redeem</h3>
            <p className="text-muted-foreground">
              Complete activities in the Streak Zone to earn coins!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Redemption</DialogTitle>
            <DialogDescription>
              {selectedTier && (
                <div className="space-y-4">
                  <p>
                    Are you sure you want to redeem <strong>ALL {totalCoins} coins</strong> for <strong>{selectedTier.name}</strong>?
                  </p>
                  <div className="bg-yellow-50 p-4 rounded-lg border">
                    <p className="text-sm text-yellow-800 font-semibold">⚠️ Important:</p>
                    <p className="text-sm text-yellow-700">
                      This will use ALL your coins. You'll start fresh with 0 coins after redemption.
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    You can always earn more coins by completing activities!
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmRedemption}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              Yes, Redeem All Coins
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}