import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronRightCircle } from "lucide-react";

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
    cell: ({getValue}) => {
      const grade = getValue() as number;
      return grade === -1 ? "Ungraded" : grade
    }
  },
  {
    accessorKey: "feedback",
    header: "Feedback",
    cell: ({getValue}) => {
      const feedback = getValue() as string;
      return feedback ? feedback.slice(0, 10) + "..." : "Pending Feedback"
    }
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      return <MoreDetails submissionid={row.original.id} />;
    },
  },
];

function MoreDetails({ submissionid }: { submissionid: string }): React.JSX.Element {
  const pathname = usePathname();
  return (
    <Link href={pathname.replace("grading", submissionid)}>
      <ChevronRightCircle className="text-muted-foreground" />
    </Link>
  );
}
