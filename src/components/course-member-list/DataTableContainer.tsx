"use client";

import { columns } from "../course-member-list/columns";
import { DataTable } from "@/components/course-member-list/data-table";
import { User } from "@prisma/client";

type Users = {
    email: string;
    role: string;
    courseId: string; 
    requestorEmail: string; // email of the requestor trying to remove member
  };

export default function DataTableContainer({
    members,
    courseId,
    requestorEmail
  }: {
    members: User[];
    courseId: string;
    requestorEmail: string;
  }) {
    const data: Users[] = members.map(user => ({
        email: user.email,
        role: user.role,
        courseId: courseId,
        requestorEmail: requestorEmail
    }));
    return <DataTable columns={columns} data={data} />;
  }
