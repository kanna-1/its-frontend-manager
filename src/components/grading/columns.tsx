import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import EditFeedbackDialog from "../dialogs/editFeedback";
import EditScoreDialog from "../dialogs/editScore";
import { usePathname } from "next/navigation";
import Link from "next/link";

type Users = {
  email: string;
  role: string;
  school_id: string;
  id: string; //submissionid
};

export const columns: ColumnDef<Users>[] = [
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
    accessorKey: "student email",
    header: "Student Email",
    cell: ({ row }) => <span>{row.original.email}</span>,
  },
  {
    accessorKey: "grade",
    header: "Grades",
  },
  {
    accessorKey: "feedback",
    header: "Feedback",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const email = row.original.email; // Extracting email from the row data
      const id = row.original.id;
      return <ActionDropdown email={email} submissionid={id} />;
    },
  },
];

// Define a separate component for the dropdown menu
const ActionDropdown: React.FC<{ email: string; submissionid: string }> = ({
  email,
  submissionid,
}) => {
  const pathname = usePathname();
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
        <Link href={pathname.replace("grading", submissionid)}>
          <DropdownMenuItem>View code</DropdownMenuItem>
        </Link>
        {/* <div>
          <EditScoreDialog submissionId={submissionid} />
        </div>
        <EditFeedbackDialog submissionId={submissionid} /> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
