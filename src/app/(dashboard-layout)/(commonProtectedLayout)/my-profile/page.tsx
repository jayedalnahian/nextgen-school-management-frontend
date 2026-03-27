import { getUserInfo } from "@/services/auth.service";
import React from "react";
import ProfileHeader from "@/components/modules/Dashboord/Profile/ProfileHeader";
import ProfileDetails from "@/components/modules/Dashboord/Profile/ProfileDetails";
import { User } from "@/types/user.types";

export default async function MyProfilePage() {
  const userInfo = await getUserInfo() as User;
  
  if (!userInfo) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-muted-foreground text-lg">Unable to load profile data.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
      </div>
      
      <ProfileHeader user={userInfo} />
      <ProfileDetails profile={userInfo.profile} />
    </div>
  );
}
