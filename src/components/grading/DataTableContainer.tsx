"use client";

import React from "react";
import { columns } from "@/components/grading/columns";
import { DataTable } from "@/components/grading/data-table";
import { UserSubmission } from "@/actions/getQuestionSubmissions";

export default function DataTableContainer({
  submissions,
}: {
  submissions: UserSubmission[];
}): React.JSX.Element {
  return <DataTable columns={columns} data={submissions} />;
}
