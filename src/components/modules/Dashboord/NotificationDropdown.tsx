"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Bell, Calendar, CheckCircle, Clock, UserPlus } from "lucide-react";

interface Notification {
    id: string;
    title: string;
    message: string;
    type : "appointment" | "schedule" | "system" | "user";
    timestamp: Date;
    read : boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: "1",
        title: "New Appointment Scheduled",
        message: "You have a new appointment scheduled with John Doe on 2024-06-15 at 10:00 AM.",
        type : "appointment",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read : false
    },
    {
        id: "2",
        title: "Schedule Updated",
        message: "Your schedule has been updated for the week of 2024-06-17.",
        type : "schedule",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        read : true
    },
    {
        id: "3",
        title: "System Maintenance",
        message: "The system will undergo maintenance on 2024-06-20 from 1:00 AM to 3:00 AM.",
        type : "system",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        read : false
    },
    {
        id: "4",
        title: "New User Registered",
        message: "A new user, Jane Smith, has registered on the platform.",
        type : "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
        read : true
    }
]

const getNotificationIcon = (type : Notification["type"]) => {
    switch(type){
        case "appointment":
            return <Calendar className="h-4 w-4 text-indigo-500"/>
        case "schedule":
            return <Clock className="h-4 w-4 text-amber-500"/>
        case "system":
            return <CheckCircle className="h-4 w-4 text-violet-500"/>
        case "user":
            return <UserPlus className="h-4 w-4 text-emerald-500"/>
        default:
            return <Bell className="h-4 w-4 text-muted-foreground"/>
    }
}



const NotificationDropdown = () => {

    const unreadCount = MOCK_NOTIFICATIONS.filter(notification => !notification.read).length;
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"} className="relative rounded-xl h-10 w-10 border-border/60 hover:bg-accent/80 transition-all duration-200">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
                        <span className="text-[10px] font-bold text-white">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    </span>
                )}
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align={"end"} className="w-80 rounded-xl border-border/50 shadow-xl">
            <DropdownMenuLabel className="flex items-center justify-between">
                <span className="font-semibold">Notifications</span>
                {
                    unreadCount > 0 && (
                        <Badge variant={"secondary"} className="ml-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/15">
                            {unreadCount} new
                        </Badge>
                    )
                }
            </DropdownMenuLabel>

            <DropdownMenuSeparator/>

            <ScrollArea className="h-75">
                {
                    MOCK_NOTIFICATIONS.length > 0 ? (
                        MOCK_NOTIFICATIONS.map(notification => (
                            <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-3 cursor-pointer rounded-lg mx-1">
                                <div className="mt-0.5 h-8 w-8 rounded-lg bg-muted/80 flex items-center justify-center shrink-0">
                                    {getNotificationIcon(notification.type)}
                                </div>

                                <div className="flex-1 space-y-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-medium leading-none truncate">
                                            {notification.title}
                                        </p>
                                        {
                                            !notification.read && (
                                                <div className="h-2 w-2 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 shrink-0"/>
                                            )
                                        }
                                    </div>

                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {notification.message}
                                    </p>

                                    <p className="text-xs text-muted-foreground/70">
                                        {formatDistanceToNow(notification.timestamp, {
                                            addSuffix: true
                                        })}
                                    </p>
                                </div>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <div className="p-6 text-center text-sm text-muted-foreground">
                            No notifications
                        </div>
                    ) 
                }
            </ScrollArea>

            <DropdownMenuSeparator/>

            <DropdownMenuItem className="text-center justify-center cursor-pointer rounded-lg mx-1 text-primary font-medium hover:text-primary">
                View All Notifications
            </DropdownMenuItem>
        </DropdownMenuContent>

    </DropdownMenu>
  )
}

export default NotificationDropdown