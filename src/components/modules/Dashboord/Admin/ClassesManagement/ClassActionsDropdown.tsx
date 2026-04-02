"use client";

import { useState } from "react";
import { IClass } from "@/types/class.types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit,
  GraduationCap,
  Users,
  BookOpen,
  ChevronRight,
} from "lucide-react";

interface ClassActionsDropdownProps {
  classData: IClass;
  onViewDetails?: (classData: IClass) => void;
  onEditClass?: (classData: IClass) => void;
  onViewAssignedTeachers?: (classData: IClass) => void;
  onAssignTeacher?: (classData: IClass) => void;
  onViewAssignedStudents?: (classData: IClass) => void;
  onAssignStudent?: (classData: IClass) => void;
  onViewAssignedSubjects?: (classData: IClass) => void;
  onAssignSubject?: (classData: IClass) => void;
}

export function ClassActionsDropdown({
  classData,
  onViewDetails,
  onEditClass,
  onViewAssignedTeachers,
  onAssignTeacher,
  onViewAssignedStudents,
  onAssignStudent,
  onViewAssignedSubjects,
  onAssignSubject,
}: ClassActionsDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* 1. Class Details */}
        <DropdownMenuItem onClick={() => onViewDetails?.(classData)}>
          <Eye className="mr-2 h-4 w-4" />
          Class Details
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* 2. Edit Class Details */}
        <DropdownMenuItem onClick={() => onEditClass?.(classData)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Class Details
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* 3. Assigned Teachers */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <GraduationCap className="mr-2 h-4 w-4" />
            Assigned Teachers
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48">
            <DropdownMenuLabel>Teachers</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewAssignedTeachers?.(classData)}>
              <Eye className="mr-2 h-4 w-4" />
              View Assigned Teachers
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAssignTeacher?.(classData)}>
              <GraduationCap className="mr-2 h-4 w-4" />
              Assign Teacher
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* 4. Assigned Students */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Users className="mr-2 h-4 w-4" />
            Assigned Students
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48">
            <DropdownMenuLabel>Students</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewAssignedStudents?.(classData)}>
              <Eye className="mr-2 h-4 w-4" />
              View Assigned Students
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAssignStudent?.(classData)}>
              <Users className="mr-2 h-4 w-4" />
              Assign Student
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* 5. Assigned Subjects */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <BookOpen className="mr-2 h-4 w-4" />
            Assigned Subjects
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48">
            <DropdownMenuLabel>Subjects</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewAssignedSubjects?.(classData)}>
              <Eye className="mr-2 h-4 w-4" />
              View Assigned Subjects
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAssignSubject?.(classData)}>
              <BookOpen className="mr-2 h-4 w-4" />
              Assign Subject
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
