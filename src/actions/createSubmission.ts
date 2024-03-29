"use server";

import prisma from "@/lib/prisma";
import { User, Question, Course, Submission } from "@prisma/client";

export async function createSubmission({
  user,
  question,
  student_solution_url,
}: {
  user: User;
  question: Question & { course: Course; submissions: Submission[] };
  student_solution_url: string;
}) {
  try {
    const newSubmission = await prisma.submission.create({
      data: {
        user_id: user.id,
        question_id: question.id,
        submitted_program: student_solution_url,
      },
    });

    await prisma.question.update({
      where: {
        id: question.id,
      },
      data: {
        submissions: {
          set: [...question.submissions, newSubmission],
        },
      },
    });

    return newSubmission;
  } catch (error) {
    console.error(error);
    return null;
  }
}
