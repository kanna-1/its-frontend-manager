"use client";

import { UserSubmission } from "@/actions/getQuestionSubmissions";
import { columns } from "@/components/grading/columns";
import { DataTable } from "@/components/grading/data-table";

export default function DataTableContainer({
  submissions,
}: {
  submissions: UserSubmission[];
}) {
  return <DataTable columns={columns} data={submissions} />;
}
