import { User } from "@/types/user.types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, CheckCircle2, XCircle } from "lucide-react";

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <Card className="mb-6 overflow-hidden border-none shadow-md">
      <div className="h-32 bg-primary/10 w-full" />
      <CardContent className="relative px-6 pb-6 pt-0 sm:px-8 sm:pb-8">
        <div className="flex flex-col sm:flex-row gap-6 relative -mt-12 sm:-mt-16 items-center sm:items-end">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-md">
            <AvatarImage src={user.image || user.profile?.image || ""} alt={user.name || "User"} />
            <AvatarFallback className="text-2xl sm:text-4xl bg-primary text-primary-foreground">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col items-center sm:items-start flex-1 gap-2 sm:mb-2 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center sm:justify-start">
              <h1 className="text-3xl font-bold tracking-tight">{user.name || "Unknown User"}</h1>
              <Badge variant="secondary" className="px-3 py-1 text-xs uppercase font-medium">
                {user.role.replace(/_/g, " ")}
              </Badge>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-muted-foreground mt-1">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                {user.emailVerified ? (
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-500 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4" /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-500 text-sm font-medium">
                    <XCircle className="h-4 w-4" /> Unverified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
