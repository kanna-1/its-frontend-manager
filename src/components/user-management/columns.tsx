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
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

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
    cell: ({ row }) => {
      const email = row.original.email; // Extracting email from the row data
      return <ActionDropdown email={email || ""} />;
    },
  },
];

// Define a separate component for the dropdown menu
const ActionDropdown: React.FC<{ email: string }> = ({ email }) => {
  const router = useRouter();

  const promoteToTeacher = async () => {
    try {
      const response = await fetch("/api/user-management/promote-to-teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error("Failed to promote user to teacher");
      }
      router.refresh();
    } catch (error) {
      console.error("Error promoting user to teacher:", error);
    }
  };

  const deleteUser = async () => {
    try {
      const response = await fetch("/api/user-management/delete-row", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      router.refresh();
    } catch (error) {
      console.error("Error deleting user:", error);
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
        <DropdownMenuItem onClick={promoteToTeacher}>Promote</DropdownMenuItem>
        <DropdownMenuItem onClick={deleteUser} className="text-destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
