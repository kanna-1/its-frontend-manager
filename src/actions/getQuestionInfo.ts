"use server";

import prisma from "@/lib/prisma";
import { Course, Question, Submission } from "@prisma/client";
import { redirect } from "next/navigation";

export async function getQuestionInfo({
  question_id,
  course_id,
  school_id,
}: {
  question_id: string;
  course_id: string;
  school_id: string;
}): Promise<(Question & { course: Course; submissions: Submission[] }) | null> {
  try {
    const question = await prisma.question.findUnique({
      where: {
        id: question_id,
      },
      include: {
        course: true,
        submissions: true,
      },
    });

    if (!question || question.courseId !== school_id + "_" + course_id) {
      redirect(`/courses/${course_id}`);
    }
    return question;
  } catch (error) {
    console.error(error);
    return null;
  }
}
