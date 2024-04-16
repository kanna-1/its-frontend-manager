"use server";

import prisma from "@/lib/prisma";
import { Submission } from "@prisma/client";

export async function setSubmissionFeedback({
  submission_id,
  feedback,
}: {
  submission_id: string;
  feedback: string;
}): Promise<Submission | null> {
  try {
    const submission = await prisma.submission.update({
      where: {
        id: submission_id,
      },
      data: {
        feedback: feedback,
      },
    });

    if (!submission) {
      return null;
    }

    return submission;
  } catch (error) {
    console.error(error);
    return null;
  }
}
