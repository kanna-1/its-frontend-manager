"use server";

import prisma from "@/lib/prisma";
import { Announcement, Course, Question, User } from "@prisma/client";

export async function getCourseInfo({
  course_id,
}: {
  course_id: string;
}): Promise<
  | (Course & {
      questions: Question[];
      members: User[];
      announcements: Announcement[];
    })
  | null
> {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: course_id,
      },
      include: {
        questions: true,
        members: true,
        announcements: true,
      },
    });

    if (!course) {
      return null;
    }
    return course;
  } catch (error) {
    console.error(error);
    return null;
  }
}
