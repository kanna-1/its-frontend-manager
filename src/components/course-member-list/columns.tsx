"use client"
import React, { useState } from 'react';
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react"
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation'

type Users = {
    email: string;
    role: string;
    courseId: string; 
    requestorEmail: string; // email of the requestor trying to remove member
  };
  
export const columns: ColumnDef<Users>[] = [
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
        cell: ({ row }) => <span>{row.original.email}</span>,
    },
    {
        accessorKey: "role",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Role
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
        cell: ({ row }) => <span>{row.original.role}</span>,
    },
    {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => (
            <RemoveButton
                requestorEmail={row.original.requestorEmail}
                courseId={row.original.courseId}
                userEmail={row.original.email}
            />
        )
    },
];

const RemoveButton = ({ requestorEmail, courseId, userEmail }) => {
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const handleRemoveMember = async () => {
        setSubmitting(true);
        try {
            const res = await fetch('/api/course-management/remove-from-course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requestorEmail: requestorEmail,
                    courseId: courseId,
                    userEmailToRemove: userEmail
                })
            });
            router.refresh();

            setTimeout(() => {
            setSubmitting(false);
            }, 500); 
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
        <Button
        onClick={handleRemoveMember}
        disabled={submitting}
        style={{
            border: 'none',
            background: 'none',
            padding: 0,
            marginLeft: 9,
            cursor: submitting ? 'not-allowed' : 'pointer',
        }}
        >
            <Trash color={submitting ? 'gray' : 'red'} size={15} />
        </Button>    
        </>
    );
};

