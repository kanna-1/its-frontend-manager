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
import { ChevronRightCircle, MoreHorizontal } from "lucide-react";
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
      return <MoreDetails submissionid={row.original.id} />;
    },
  },
];

function MoreDetails({ submissionid }: { submissionid: string }) {
  const pathname = usePathname();
  return (
    <Link href={pathname.replace("grading", submissionid)}>
      <ChevronRightCircle className="text-muted-foreground" />
    </Link>
  );
}
