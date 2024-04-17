"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Course, School, Submission, User } from "@prisma/client";

export async function getUserProps({
  include_school,
  include_courses,
  include_submissions,
}: {
  include_school: boolean;
  include_courses: boolean;
  include_submissions: boolean;
}): Promise<
  User & {
    school: School;
    created_courses: Course[];
    joined_courses: Course[];
    submissions: Submission[];
  }
> {
  const session = await auth();
  const session_user = session?.user;

  if (!session_user || !session_user.email) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session_user.email },
    include: {
      school: include_school,
      created_courses: include_courses,
      joined_courses: include_courses,
      submissions: include_submissions,
    },
  });

  if (!user) {
    redirect("/signin");
  }

  return user;
}
