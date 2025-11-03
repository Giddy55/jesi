import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Crown, Zap, Star, Sparkles } from "lucide-react";

interface PremiumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PremiumDialog({ open, onOpenChange }: PremiumDialogProps) {
  const features = [
    "Unlimited practice questions",
    "Advanced AI tutor assistance",
    "Detailed progress analytics",
    "Priority learning support",
    "Exclusive learning resources",
    "Ad-free experience",
    "Custom study schedules",
    "Certificate of completion"
  ];

  const plans = [
    {
      name: "Monthly",
      price: "$9.99",
      period: "/month",
      icon: Zap,
      popular: false
    },
    {
      name: "Yearly",
      price: "$89.99",
      period: "/year",
      savings: "Save 25%",
      icon: Star,
      popular: true
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Unlock the full potential of your learning journey
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Plans */}
          <div className="grid md:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`p-6 relative ${
                  plan.popular
                    ? "border-primary shadow-lg scale-105"
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-4">
                  <plan.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <div className="mt-2 text-sm text-green-600 font-medium">
                      {plan.savings}
                    </div>
                  )}
                </div>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  Choose Plan
                </Button>
              </Card>
            ))}
          </div>

          {/* Features */}
          <div className="bg-muted/50 rounded-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              Premium Features
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust badges */}
          <div className="text-center text-sm text-muted-foreground">
            <p>✓ Cancel anytime • ✓ 7-day money-back guarantee</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
