"use client";

import React from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/course-member-list/dataTable";
import { User } from "@prisma/client";

type Users = {
    email: string;
    role: string;
    courseId: string; 
    requestorEmail: string; // email of the requestor trying to remove member
  };

export default function DataTableContainer ({
  members,
  courseId,
  requestorEmail
}: {
  members: User[];
  courseId: string;
  requestorEmail: string;
  }): React.JSX.Element {
  const data: Users[] = members.map(user => ({
    email: user.email,
    role: user.role,
    courseId: courseId,
    requestorEmail: requestorEmail
  }
  ));
  return <DataTable columns={columns} data={data} />;
}
