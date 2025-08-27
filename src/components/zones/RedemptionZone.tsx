import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Coins, Gift, Trophy, Star, Zap, Crown, Heart, Sparkles, ShoppingBag } from "lucide-react";
import { MysteryBox } from "@/components/ui/mystery-box";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

interface RedemptionZoneProps {
  totalCoins: number;
  onCoinsUpdate: (newTotal: number) => void;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: string;
  icon: any;
  rarity: "common" | "rare" | "epic" | "legendary";
  owned?: boolean;
}

const rewards: Reward[] = [
  // Common Rewards (10-50 coins)
  { id: "1", name: "High Five", description: "Get a virtual high five from Jesi!", cost: 10, category: "Fun", icon: Star, rarity: "common" },
  { id: "2", name: "Motivational Quote", description: "Receive a personalized motivational message", cost: 15, category: "Inspiration", icon: Heart, rarity: "common" },
  { id: "3", name: "Study Tip", description: "Unlock a helpful study technique", cost: 20, category: "Learning", icon: Zap, rarity: "common" },
  { id: "4", name: "Fun Fact", description: "Learn an interesting fact about your subject", cost: 25, category: "Knowledge", icon: Sparkles, rarity: "common" },
  
  // Rare Rewards (60-150 coins)
  { id: "5", name: "Extra Practice Problems", description: "Unlock bonus practice questions", cost: 75, category: "Learning", icon: Trophy, rarity: "rare" },
  { id: "6", name: "Study Buddy Chat", description: "15 minutes of focused study help from Jesi", cost: 100, category: "Support", icon: Gift, rarity: "rare" },
  { id: "7", name: "Progress Certificate", description: "A beautiful certificate of your achievements", cost: 120, category: "Achievement", icon: Crown, rarity: "rare" },
  
  // Epic Rewards (200-400 coins)
  { id: "8", name: "Mystery Box", description: "A surprise reward with bonus coins!", cost: 200, category: "Surprise", icon: Gift, rarity: "epic" },
  { id: "9", name: "Subject Mastery Badge", description: "Unlock a special badge for your profile", cost: 300, category: "Achievement", icon: Crown, rarity: "epic" },
  
  // Legendary Rewards (500+ coins)
  { id: "10", name: "Golden Crown", description: "The ultimate achievement badge!", cost: 500, category: "Achievement", icon: Crown, rarity: "legendary" },
];

export function RedemptionZone({ totalCoins, onCoinsUpdate }: RedemptionZoneProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [ownedRewards, setOwnedRewards] = useState<string[]>([]);
  const [showMysteryBox, setShowMysteryBox] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<Reward | null>(null);
  const { toast } = useToast();

  const categories = ["All", "Fun", "Learning", "Achievement", "Support", "Inspiration", "Knowledge", "Surprise"];

  const filteredRewards = rewards.filter(reward => 
    selectedCategory === "All" || reward.category === selectedCategory
  );

  const triggerSuccessConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF8C00']
    });
  };

  const handlePurchase = (reward: Reward) => {
    if (totalCoins >= reward.cost) {
      onCoinsUpdate(totalCoins - reward.cost);
      setOwnedRewards([...ownedRewards, reward.id]);
      
      if (reward.id === "8") {
        // Mystery Box
        setShowMysteryBox(true);
      } else {
        triggerSuccessConfetti();
        toast({
          title: "Reward Unlocked! 🎉",
          description: `You've successfully redeemed "${reward.name}"!`,
        });
      }
      
      setShowConfirmDialog(null);
    }
  };

  const handleMysteryBoxOpen = (bonusCoins: number) => {
    onCoinsUpdate(totalCoins + bonusCoins);
    setShowMysteryBox(false);
    triggerSuccessConfetti();
    toast({
      title: "Mystery Box Opened! ✨",
      description: `You found ${bonusCoins} bonus coins inside!`,
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-500";
      case "rare": return "bg-blue-500";
      case "epic": return "bg-purple-500";
      case "legendary": return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      default: return "bg-gray-500";
    }
  };

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-600";
      case "rare": return "text-blue-600";
      case "epic": return "text-purple-600";
      case "legendary": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
          <ShoppingBag className="w-10 h-10" />
          Reward Store
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Exchange your hard-earned coins for amazing rewards!
        </p>
        
        {/* Current Coins Display */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-6 rounded-2xl inline-block mb-8">
          <div className="flex items-center gap-3">
            <Coins className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90">Your Balance</p>
              <p className="text-3xl font-bold">{totalCoins} Coins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="hover-lift"
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map((reward) => {
          const isOwned = ownedRewards.includes(reward.id);
          const canAfford = totalCoins >= reward.cost;
          const IconComponent = reward.icon;

          return (
            <Card key={reward.id} className={`relative overflow-hidden hover-lift ${isOwned ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${getRarityColor(reward.rarity)} rounded-xl flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{reward.name}</CardTitle>
                      <Badge variant="outline" className={getRarityTextColor(reward.rarity)}>
                        {reward.rarity.charAt(0).toUpperCase() + reward.rarity.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  {isOwned && (
                    <Badge variant="secondary" className="bg-green-500 text-white">
                      Owned
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4">{reward.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-500" />
                    <span className="font-bold text-lg">{reward.cost}</span>
                  </div>
                  
                  <Button
                    onClick={() => setShowConfirmDialog(reward)}
                    disabled={!canAfford || isOwned}
                    className={`
                      ${canAfford && !isOwned 
                        ? 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90' 
                        : ''
                      }
                    `}
                  >
                    {isOwned ? 'Owned' : canAfford ? 'Redeem' : 'Need More Coins'}
                  </Button>
                </div>
              </CardContent>
              
              {reward.rarity === "legendary" && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-bl-lg text-xs font-bold">
                  LEGENDARY
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={!!showConfirmDialog} onOpenChange={() => setShowConfirmDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogDescription>
              {showConfirmDialog && (
                <>
                  Are you sure you want to redeem "{showConfirmDialog.name}" for {showConfirmDialog.cost} coins?
                  <br />
                  <span className="font-semibold">
                    You'll have {totalCoins - showConfirmDialog.cost} coins remaining.
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowConfirmDialog(null)}>
              Cancel
            </Button>
            <Button 
              onClick={() => showConfirmDialog && handlePurchase(showConfirmDialog)}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              Confirm Purchase
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mystery Box Dialog */}
      <Dialog open={showMysteryBox} onOpenChange={setShowMysteryBox}>
        <DialogContent className="max-w-md">
          <MysteryBox 
            onOpen={handleMysteryBoxOpen}
            className="border-0 shadow-none"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}