"use client";

import React from "react";
import { ArrowUpDown, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

type Users = {
  email: string;
  role: string;
  courseId: string;
  requestorEmail: string; // email of the requestor trying to remove member
};

export const columns: ColumnDef<Users>[] = [
  {
    accessorKey: "email",
    header: ({ column }): React.ReactNode => {
      return (
        <div className="flex items-center">
          <span>Email</span>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown size={16} />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => <span>{row.original.email}</span>,
  },
  {
    accessorKey: "role",
    header: ({ column }): React.ReactNode => {
      return (
        <div className="flex items-center">
          <span>Role</span>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown size={16} />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => <span>{row.original.role}</span>,
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <RemoveButton
        courseId={row.original.courseId}
        userEmail={row.original.email}
      />
    ),
  },
];

const RemoveButton: React.FC<{
  courseId: string;
  userEmail: string;
}> = ({ courseId, userEmail }) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleRemoveMember : () => Promise<void> = async () => {
    try {
      const res = await fetch("/api/course-management/remove-from-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course_id: courseId,
          user_email_to_remove: userEmail,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to remove user from the course.");
      }
      toast({
        title: "User Removed Success",
        description: `${userEmail} has been successfully removed from the course.`,
        variant: "success",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "User Removed Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={() => {
        toast({
          title: "Are you sure you want to delete?",
          description: "This action is irreversible.",
          variant: "destructive",
          action: (
            <ToastAction altText="confirm" onClick={handleRemoveMember}>
              Confirm
            </ToastAction>
          ),
        });
      }}
      variant="ghost"
    >
      <Trash color="red" size={16} />
    </Button>
  );
};
