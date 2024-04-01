import { getQuestionSubmissions } from "@/actions/getQuestionSubmissions";
import { getUserProps } from "@/actions/getUserProps";
import DataTableContainer from "@/components/grading/DataTableContainer";
import { Button } from "@/components/ui/button";
import { Role } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function GradingDashboardView({
  params,
}: {
  params: { questionId: string; courseId: string };
}) {
  const user = await getUserProps({
    includeSchool: false,
    includeCourses: false,
    includeSubmissions: false,
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
