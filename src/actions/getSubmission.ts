"use server";

import prisma from "@/lib/prisma";
import { Submission } from "@prisma/client";

export async function getSubmission({
  submission_id,
}: {
  submission_id: string;
}): Promise<Submission | null> {
  try {
    const submission = await prisma.submission.findUnique({
      where: {
        id: submission_id,
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
