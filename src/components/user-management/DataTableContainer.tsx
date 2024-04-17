"use client";

import React from "react";
import { User } from "@prisma/client";
import { columns } from "@/components/user-management/columns";
import { DataTable } from "@/components/user-management/dataTable";

export default function DataTableContainer({
  name,
  users,
}: {
  name: string;
  users: User[];
}): React.JSX.Element {
  return <DataTable institution={name} columns={columns} data={users} />;
}
