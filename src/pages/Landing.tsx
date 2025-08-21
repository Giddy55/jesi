import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Users, Shield, BookOpen, Target, Star, Sparkles } from "lucide-react";

interface LandingProps {
  onLogin: (userType: "student" | "parent" | "admin", userData: any) => void;
}

export function Landing({ onLogin }: LandingProps) {
  const [studentForm, setStudentForm] = useState({ 
    email: "", 
    password: "", 
    level: "" 
  });
  const [parentForm, setParentForm] = useState({ email: "", password: "" });
  const [adminForm, setAdminForm] = useState({ email: "", password: "" });

  const handleStudentLogin = () => {
    const levelData = {
      "lower-primary": {
        name: "Emma Wilson",
        class: "Primary 3B",
        age: 9,
        email: studentForm.email || "emma.wilson@school.edu"
      },
      "jhs": {
        name: "David Asante",
        class: "JHS 2A",
        age: 14,
        email: studentForm.email || "david.asante@school.edu"
      },
      "shs": {
        name: "Michael Chen",
        class: "SHS 2A",
        age: 17,
        email: studentForm.email || "michael.chen@school.edu"
      }
    };

    const selectedLevel = studentForm.level || "lower-primary";
    const userData = levelData[selectedLevel as keyof typeof levelData];
    
    onLogin("student", {
      ...userData,
      level: selectedLevel
    });
  };

  const handleParentLogin = () => {
    onLogin("parent", {
      name: "Sarah Johnson",
      children: ["Alex Johnson", "Emma Johnson"],
      email: parentForm.email || "sarah.johnson@email.com"
    });
  };

  const handleAdminLogin = () => {
    onLogin("admin", {
      name: "Dr. Michael Adams",
      role: "Principal",
      school: "Greenfield Academy",
      email: adminForm.email || "m.adams@greenfield.edu"
    });
  };

  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "Interactive Learning",
      description: "Engaging lessons with AI-powered assistance"
    },
    {
      icon: <Target className="w-8 h-8 text-accent" />,
      title: "Progress Tracking",
      description: "Monitor learning progress and achievements"
    },
    {
      icon: <Star className="w-8 h-8 text-warning" />,
      title: "Gamified Experience",
      description: "Earn coins, streaks, and unlock achievements"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <GraduationCap className="w-12 h-12 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EduZone
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transform learning with AI-powered education platform designed for students, parents, and educators
          </p>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Login Section */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Welcome Back!</CardTitle>
              <p className="text-center text-muted-foreground">Choose your account type to continue</p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="student" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="student" className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Student
                  </TabsTrigger>
                  <TabsTrigger value="parent" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Parent
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Admin
                  </TabsTrigger>
                </TabsList>

                {/* Student Login */}
                <TabsContent value="student" className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <GraduationCap className="w-6 h-6 text-primary" />
                      <Badge variant="secondary" className="text-sm font-medium">
                        Student Portal
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Welcome to Your Learning Journey! 🚀
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Select your level and dive into an amazing learning experience
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="student-level" className="text-sm font-medium">
                        Select Your Level
                      </Label>
                      <Select 
                        value={studentForm.level} 
                        onValueChange={(value) => setStudentForm({...studentForm, level: value})}
                      >
                        <SelectTrigger className="w-full h-12 border-2 border-border/50 bg-background/50 hover:border-primary/50 transition-colors">
                          <SelectValue placeholder="Choose your learning level..." />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border shadow-lg">
                          <SelectItem value="lower-primary" className="py-3 px-4 hover:bg-accent/50">
                            <div className="flex items-center gap-3">
                              <BookOpen className="w-4 h-4 text-green-500" />
                              <div>
                                <div className="font-medium">Lower Primary</div>
                                <div className="text-xs text-muted-foreground">Grades 1-3 • Ages 6-9</div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="jhs" className="py-3 px-4 hover:bg-accent/50">
                            <div className="flex items-center gap-3">
                              <Target className="w-4 h-4 text-blue-500" />
                              <div>
                                <div className="font-medium">Junior High School (JHS)</div>
                                <div className="text-xs text-muted-foreground">JHS 1-3 • Ages 12-15</div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="shs" className="py-3 px-4 hover:bg-accent/50">
                            <div className="flex items-center gap-3">
                              <Star className="w-4 h-4 text-purple-500" />
                              <div>
                                <div className="font-medium">Senior High School (SHS)</div>
                                <div className="text-xs text-muted-foreground">SHS 1-3 • Ages 16-18</div>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="student-email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="student-email"
                        type="email"
                        placeholder="Enter your school email..."
                        value={studentForm.email}
                        onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                        className="h-12 border-2 border-border/50 bg-background/50 hover:border-primary/50 focus:border-primary transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="student-password" className="text-sm font-medium">Password</Label>
                      <Input
                        id="student-password"
                        type="password"
                        placeholder="Enter your password..."
                        value={studentForm.password}
                        onChange={(e) => setStudentForm({...studentForm, password: e.target.value})}
                        className="h-12 border-2 border-border/50 bg-background/50 hover:border-primary/50 focus:border-primary transition-colors"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleStudentLogin} 
                      className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Start Learning Journey
                    </Button>
                    
                    <div className="text-center">
                      <Badge variant="outline" className="text-xs bg-muted/30">
                        Demo Mode: Any email/password works!
                      </Badge>
                    </div>
                  </div>
                </TabsContent>

                {/* Parent Login */}
                <TabsContent value="parent" className="space-y-4">
                  <div className="text-center mb-4">
                    <Badge variant="secondary" className="mb-2">Demo Account</Badge>
                    <p className="text-sm text-muted-foreground">
                      Monitor your child's learning progress
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="parent-email">Email</Label>
                      <Input
                        id="parent-email"
                        type="email"
                        placeholder="sarah.johnson@email.com"
                        value={parentForm.email}
                        onChange={(e) => setParentForm({...parentForm, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="parent-password">Password</Label>
                      <Input
                        id="parent-password"
                        type="password"
                        placeholder="Enter your password"
                        value={parentForm.password}
                        onChange={(e) => setParentForm({...parentForm, password: e.target.value})}
                      />
                    </div>
                    <Button onClick={handleParentLogin} className="w-full">
                      Login as Parent
                    </Button>
                    <div className="text-xs text-muted-foreground text-center">
                      Demo: Any email/password will work
                    </div>
                  </div>
                </TabsContent>

                {/* Admin Login */}
                <TabsContent value="admin" className="space-y-4">
                  <div className="text-center mb-4">
                    <Badge variant="secondary" className="mb-2">Demo Account</Badge>
                    <p className="text-sm text-muted-foreground">
                      Manage school-wide analytics and settings
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="admin-email">Email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="m.adams@greenfield.edu"
                        value={adminForm.email}
                        onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="admin-password">Password</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={adminForm.password}
                        onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                      />
                    </div>
                    <Button onClick={handleAdminLogin} className="w-full">
                      Login as Admin
                    </Button>
                    <div className="text-xs text-muted-foreground text-center">
                      Demo: Any email/password will work
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>© 2024 EduZone. Transforming education through technology.</p>
        </div>
      </div>
    </div>
  );
}