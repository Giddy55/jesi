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

const REDEMPTION_THRESHOLD = 1000;

const specialReward = {
  name: "Ultimate Scholar Achievement",
  description: "Congratulations on reaching 1000 coins! You've proven your dedication to learning.",
  benefits: [
    "Personalized Certificate of Excellence",
    "3 Premium mentoring sessions with Jesi",
    "Access to exclusive advanced learning modules",
    "Special Scholar recognition badge",
    "Custom learning path designed just for you",
    "VIP priority support access",
    "Exclusive learning resources library",
    "Achievement showcase on your profile"
  ],
  icon: Crown,
  color: "text-yellow-600",
  bgGradient: "from-yellow-100 via-yellow-200 to-yellow-300"
};

export function RedemptionZone({ totalCoins, onCoinsUpdate }: RedemptionZoneProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasRedeemed, setHasRedeemed] = useState(false);
  const { toast } = useToast();

  const canRedeem = totalCoins >= REDEMPTION_THRESHOLD;
  const coinsNeeded = REDEMPTION_THRESHOLD - totalCoins;
  const progressPercentage = Math.min((totalCoins / REDEMPTION_THRESHOLD) * 100, 100);

  const triggerSuccessConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF8C00', '#87CEEB', '#98FB98']
    });
  };

  const handleRedeem = () => {
    setShowConfirmDialog(true);
  };

  const confirmRedemption = () => {
    // Redeem ALL coins for the reward
    onCoinsUpdate(0);
    setHasRedeemed(true);
    
    triggerSuccessConfetti();
    toast({
      title: `🎉 ${specialReward.name} Unlocked!`,
      description: `Congratulations! You've redeemed ${totalCoins} coins for your Ultimate Achievement!`,
    });
    
    setShowConfirmDialog(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
          <Crown className="w-10 h-10" />
          Ultimate Achievement Center
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Reach 1000 coins to unlock your Ultimate Scholar Achievement!
        </p>
        
        {/* Current Coins Display */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-6 rounded-2xl inline-block mb-8">
          <div className="flex items-center gap-3">
            <Coins className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90">Your Total Balance</p>
              <p className="text-3xl font-bold">{totalCoins} / {REDEMPTION_THRESHOLD} Coins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Towards 1000 Coins */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-4 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {canRedeem ? (
                  <span className="text-green-600 font-semibold">🎉 Ready to redeem!</span>
                ) : (
                  <span>You need {coinsNeeded} more coins to unlock your achievement</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ultimate Achievement Available */}
      {canRedeem && !hasRedeemed && (
        <Card className="border-4 border-yellow-300 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center gap-2 text-xl">
              <CheckCircle className="w-6 h-6" />
              🎉 Ultimate Achievement Ready!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Card className={`bg-gradient-to-br ${specialReward.bgGradient} border-2 border-yellow-400 shadow-lg`}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                    <Crown className={`w-8 h-8 ${specialReward.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{specialReward.name}</CardTitle>
                    <p className="text-muted-foreground">{specialReward.description}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4 mb-6">
                  <p className="font-semibold text-gray-700 text-lg">🎁 What you'll receive:</p>
                  <ul className="space-y-2">
                    {specialReward.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3 text-sm">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="font-medium">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-6 h-6 text-yellow-500" />
                    <span className="font-bold text-lg">Costs all {totalCoins} coins</span>
                  </div>
                  
                  <Button
                    onClick={handleRedeem}
                    size="lg"
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    🏆 Claim Your Achievement
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      {/* Already Redeemed Achievement */}
      {hasRedeemed && (
        <Card className="border-4 border-green-300 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center gap-2 text-xl">
              <Trophy className="w-6 h-6" />
              🎉 Achievement Unlocked!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Crown className="w-20 h-20 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-700 mb-2">{specialReward.name}</h3>
              <p className="text-green-600 font-semibold">✅ Successfully Redeemed</p>
              <p className="text-sm text-muted-foreground mt-2">
                Congratulations on your dedication to learning! Keep earning coins for future achievements.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Motivational Message for Low Coins */}
      {totalCoins > 0 && totalCoins < REDEMPTION_THRESHOLD && (
        <Card>
          <CardContent className="text-center py-8">
            <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">Keep Learning!</h3>
            <p className="text-muted-foreground mb-4">
              You're doing great! Complete more activities in the Streak Zone to reach 1000 coins.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border inline-block">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Each completed activity earns you coins. Stay consistent to reach your goal faster!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No coins message */}
      {totalCoins === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Coins className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">Start Your Journey!</h3>
            <p className="text-muted-foreground">
              Complete activities in the Streak Zone to start earning coins toward your Ultimate Achievement!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-600" />
              Confirm Ultimate Achievement
            </DialogTitle>
            <DialogDescription>
              <div className="space-y-4">
                <p className="text-lg">
                  Are you sure you want to redeem <strong>ALL {totalCoins} coins</strong> for your <strong>{specialReward.name}</strong>?
                </p>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800 font-semibold flex items-center gap-2">
                    ⚠️ Important Information:
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    This will use ALL your coins and reset your balance to 0. You can always earn more coins by completing activities!
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 font-semibold">
                    🎁 You'll receive all the amazing benefits listed above!
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmRedemption}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold"
            >
              🏆 Yes, Claim My Achievement!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}