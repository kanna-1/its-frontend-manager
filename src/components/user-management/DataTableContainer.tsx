"use client";

import { columns } from "@/components/user-management/columns";
import { DataTable } from "@/components/user-management/data-table";
import { User } from "@prisma/client";

export default function DataTableContainer({
  name,
  users,
}: {
  name: string;
  users: User[];
}) {
  return <DataTable institution={name} columns={columns} data={users} />;
}
