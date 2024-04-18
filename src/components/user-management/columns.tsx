import React from "react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "select",
    header: "Select",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }): React.JSX.Element => {
      const email = row.original.email; // Extracting email from the row data
      return <ActionDropdown email={email || ""} />;
    },
  },
];

// Define a separate component for the dropdown menu
const ActionDropdown: React.FC<{ email: string }> = ({ email }) => {
  const router = useRouter();
  const { toast } = useToast();

  const promoteToTeacher : () => Promise<void> = async () => {
    try {
      const response = await fetch("/api/user-management/promote-to-teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const message = (await response.json()).error;
        throw new Error(message);
      }
      toast({
        title: "Promotion Success",
        description: `${email} has been successfully promoted to a teacher.`,
        variant: "success",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Promotion Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteUser: () => Promise<void> = async () => {
    try {
      const response = await fetch("/api/user-management/delete-row", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const message = (await response.json()).error;
        throw new Error(message);
      }
      toast({
        title: "Deletion Success",
        description: `${email} has been successfully deleted.`,
        variant: "success",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Deletion Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            toast({
              title: "Are you sure you want to promote?",
              description: "Teacher accounts have special access permissions.",
              action: (
                <ToastAction altText="confirm" onClick={promoteToTeacher}>
                  Confirm
                </ToastAction>
              ),
            });
          }}
        >
          Promote
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            toast({
              title: "Are you sure you want to delete?",
              description: "This action is irreversible.",
              variant: "destructive",
              action: (
                <ToastAction altText="confirm" onClick={deleteUser}>
                  Confirm
                </ToastAction>
              ),
            });
          }}
          className="text-destructive"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
