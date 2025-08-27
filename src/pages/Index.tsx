import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Landing } from "./Landing";
import { Navigation } from "@/components/layout/Navigation";
import { ClassZone } from "@/components/zones/ClassZone";
import { LearnZone } from "@/components/zones/LearnZone";
import { PracticeZone } from "@/components/zones/PracticeZone";
import { StreakZone } from "@/components/zones/StreakZone";
import { InsightZone } from "@/components/zones/InsightZone";
import { ShsWelcome } from "@/components/zones/shs/ShsWelcome";
import { ProfilePanel } from "@/components/layout/ProfilePanel";
import { FloatingChatbot } from "@/components/layout/FloatingChatbot";

const Index = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  const [activeZone, setActiveZone] = useState<string>(user?.level === "shs" ? "welcome" : "class");

  // If not authenticated, show landing page
  if (!isAuthenticated) {
    return <Landing onLogin={login} />;
  }

  const renderActiveZone = () => {
    const userType = user?.type as "student" | "parent" | "admin";
    
    switch (activeZone) {
      case "welcome":
        return <ShsWelcome user={user} onZoneChange={setActiveZone} />;
      case "class": 
        return <ClassZone userType={userType} user={user} onZoneChange={setActiveZone} />;
      case "learn": 
        return <LearnZone onZoneChange={setActiveZone} />;
      case "practice": 
        return <PracticeZone user={user} />;
      case "streak": 
        return <StreakZone />;
      case "insights": 
        return <InsightZone userType={userType} user={user} onZoneChange={setActiveZone} />;
      default: 
        return user?.level === "shs" ? <ShsWelcome user={user} onZoneChange={setActiveZone} /> : <ClassZone userType={userType} user={user} onZoneChange={setActiveZone} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <Navigation 
            activeZone={activeZone} 
            onZoneChange={setActiveZone}
            userType={user?.type as "student" | "parent" | "admin"}
            user={user}
            onLogout={logout}
          />
          <main id="main-content" className="flex-1 max-w-4xl" role="main">
            {renderActiveZone()}
          </main>
          <ProfilePanel user={user} onLogout={logout} />
        </div>
      </div>
      <FloatingChatbot />
    </div>
  );
};

export default Index;
