import { IResult } from "@/types/result.types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Award, FileText } from "lucide-react";

export const resultsColumns: ColumnDef<IResult>[] = [
  {
    id: "student",
    accessorKey: "student.name",
    header: "Student",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">{row.original.student?.name || "Unknown"}</span>
        <span className="text-muted-foreground text-xs font-mono">{row.original.student?.studentID || row.original.studentId}</span>
      </div>
    ),
  },
  {
    id: "class",
    accessorKey: "student.class.name",
    header: "Class",
    enableSorting: false,
    cell: ({ row }) => {
      const className = row.original.student?.class?.name;
      const section = row.original.student?.class?.section;
      return className ? (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {section ? `${className} - ${section}` : className}
        </Badge>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
  },
  {
    id: "exam",
    accessorKey: "exam.name",
    header: "Exam",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-sm">{row.original.exam?.name || "Unknown"}</span>
      </div>
    ),
  },
  {
    id: "subject",
    accessorKey: "subject.name",
    header: "Subject",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-sm">{row.original.subject?.name || "Unknown"}</span>
        {row.original.subject?.code && (
          <span className="text-xs text-muted-foreground">({row.original.subject.code})</span>
        )}
      </div>
    ),
  },
  {
    id: "marks",
    accessorKey: "marksObtained",
    header: "Marks",
    cell: ({ row }) => {
      const marks = row.original.marksObtained;
      const totalMarks = row.original.exam?.totalMarks || 100;
      const percentage = (marks / totalMarks) * 100;
      
      let variant: "default" | "secondary" | "destructive" | "outline" = "default";
      if (percentage >= 80) variant = "default";
      else if (percentage >= 60) variant = "secondary";
      else variant = "destructive";
      
      return (
        <div className="flex items-center gap-1.5">
          <Award className="h-4 w-4 text-muted-foreground" />
          <Badge variant={variant} className="font-mono">
            {marks}/{totalMarks}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "grade",
    accessorKey: "grade",
    header: "Grade",
    enableSorting: false,
    cell: ({ row }) => {
      const grade = row.original.grade;
      if (!grade) return <span className="text-muted-foreground text-sm">-</span>;
      
      let className = "bg-gray-100 text-gray-800 border-gray-200";
      if (grade.startsWith("A")) className = "bg-green-100 text-green-800 border-green-200";
      else if (grade.startsWith("B")) className = "bg-blue-100 text-blue-800 border-blue-200";
      else if (grade.startsWith("C")) className = "bg-yellow-100 text-yellow-800 border-yellow-200";
      else if (grade.startsWith("D") || grade.startsWith("F")) className = "bg-red-100 text-red-800 border-red-200";
      
      return (
        <div className="flex items-center gap-1.5">
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
          <Badge variant="outline" className={className}>
            {grade}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "remarks",
    accessorKey: "remarks",
    header: "Remarks",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground truncate max-w-[150px] block">
        {row.original.remarks || "-"}
      </span>
    ),
  },
];
