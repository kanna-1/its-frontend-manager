import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { getQuestionSubmissions } from "@/actions/getQuestionSubmissions";
import { getUserProps } from "@/actions/getUserProps";
import { Button } from "@/components/ui/button";
import DataTableContainer from "@/components/grading/DataTableContainer";

export default async function GradingDashboardView({
  params,
}: {
  params: { questionId: string; courseId: string };
}): Promise<React.JSX.Element> {
  const user = await getUserProps({
    include_school: false,
    include_courses: false,
    include_submissions: false,
  });

  if (user.role != Role.TEACHER) {
    redirect(`/courses/${params.courseId}`);
  }

  const question = { question_id: params.questionId };
  const submissions = await getQuestionSubmissions(question);

  if (!submissions) {
    redirect(`/courses/${params.courseId}`);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Grading Dashboard</h1>
        <Link href={`/courses/${params.courseId}`}>
          <Button variant="secondary">Return to course</Button>
        </Link>
      </div>
      <DataTableContainer submissions={submissions}></DataTableContainer>
    </>
  );
}
