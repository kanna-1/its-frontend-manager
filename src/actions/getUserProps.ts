"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function getUserProps({
  includeSchool,
  includeCourses,
  includeSubmissions,
}: {
  includeSchool: boolean;
  includeCourses: boolean;
  includeSubmissions: boolean;
}) {
  const session = await auth();
  const session_user = session?.user;

  if (!session_user || !session_user.email) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session_user.email },
    include: {
      school: includeSchool,
      created_courses: includeCourses,
      joined_courses: includeCourses,
      submissions: includeSubmissions,
    },
  });

  if (!user) {
    redirect("/signin");
  }

  return user;
}
