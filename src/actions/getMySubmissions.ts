"use server";

import prisma from "@/lib/prisma";
import { Submission } from "@prisma/client";

export async function getMySubmissions({
  question_id,
  user_email,
}: {
  question_id: string;
  user_email: string;
}): Promise<Submission[] | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: user_email,
      },
      include: {
        submissions: true,
      },
    });

    if (!user) {
      return null;
    }

    const submissions = user.submissions.filter(
      (submission) => submission.question_id === question_id
    );

    return submissions;
  } catch (error) {
    console.error(error);
    return null;
  }
}
