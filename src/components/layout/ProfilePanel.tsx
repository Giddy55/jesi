import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Mail, User, LogOut, GraduationCap } from "lucide-react";

interface ProfilePanelProps {
  user?: any;
  onLogout?: () => void;
}

export function ProfilePanel({ user, onLogout }: ProfilePanelProps) {
  if (!user) return null;
  const initials = user.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "U";

  return (
    <div className="hidden lg:block w-20 h-fit p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="p-0 rounded-full h-auto"
            aria-label="Open profile"
          >
            <Avatar className="w-12 h-12">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="w-64 bg-background z-50">
          <div className="px-3 py-2">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground capitalize">{user.type || "student"}</div>
              </div>
            </div>
          </div>
          <Separator />
          {user.class && (
            <DropdownMenuItem className="gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>{user.class}</span>
            </DropdownMenuItem>
          )}
          {user.email && (
            <DropdownMenuItem className="gap-2">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive gap-2 cursor-pointer">
            <LogOut className="w-4 h-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
