"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import { UserEditModal } from "./UserEditModal";

// User type based on the combined data from tables
interface IUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
  role: "ADMIN" | "TEACHER" | "PARENT" | "SUPER_ADMIN";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  admin?: {
    designation?: string | null;
    phone?: string | null;
    joiningDate?: string | null;
  } | null;
  teacher?: {
    specialization?: string | null;
    qualification?: string | null;
    bio?: string | null;
    phone?: string | null;
    joiningDate?: string | null;
  } | null;
  parent?: {
    phone?: string | null;
    address?: string | null;
    occupation?: string | null;
  } | null;
}

interface UserActionsCellProps {
  user: IUser;
  onView?: (user: IUser) => void;
  onDelete?: (user: IUser) => void;
}

export function UserActionsCell({ user, onView, onDelete }: UserActionsCellProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open Menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {onView && (
          <DropdownMenuItem onClick={() => onView(user)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <div className="flex items-center cursor-pointer">
            <UserEditModal user={user} />
            <span className="ml-2">Edit</span>
          </div>
        </DropdownMenuItem>

        {onDelete && (
          <DropdownMenuItem onClick={() => onDelete(user)} className="text-destructive">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
