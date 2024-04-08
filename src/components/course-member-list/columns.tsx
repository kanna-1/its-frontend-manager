"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastAction } from "@/components/ui/toast";

type Users = {
  email: string;
  role: string;
  courseId: string;
  requestorEmail: string; // email of the requestor trying to remove member
};

export const columns: ColumnDef<Users>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => {
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
    header: ({ column }) => {
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
        requestorEmail={row.original.requestorEmail}
        courseId={row.original.courseId}
        userEmail={row.original.email}
      />
    ),
  },
];

const RemoveButton: React.FC<{
  requestorEmail: string;
  courseId: string;
  userEmail: string;
}> = ({ requestorEmail, courseId, userEmail }) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleRemoveMember = async () => {
    try {
      const res = await fetch("/api/course-management/remove-from-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestorEmail: requestorEmail,
          courseId: courseId,
          userEmailToRemove: userEmail,
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
