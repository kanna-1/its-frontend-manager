"use server";

import prisma from "@/lib/prisma";
import { Course, Question, Submission, User } from "@prisma/client";

export async function createSubmission({
  user,
  question,
  student_solution_url,
}: {
  user: User;
  question: Question & { course: Course; submissions: Submission[] };
  student_solution_url: string;
}): Promise<Submission | null> {
  try {
    const new_submission = await prisma.submission.create({
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
          set: [...question.submissions, new_submission],
        },
      },
    });

    return new_submission;
  } catch (error) {
    console.error(error);
    return null;
  }
}
