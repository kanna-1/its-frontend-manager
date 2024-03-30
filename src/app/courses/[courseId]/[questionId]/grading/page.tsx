import { getQuestionSubmissions } from "@/actions/getQuestionSubmissions";
import DataTableContainer from "@/components/grading/DataTableContainer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function GradingDashboardView({
  params,
}: {
  params: { questionId: string; courseId: string };
}) {
  const question = { question_id: params.questionId };
  const submissions = await getQuestionSubmissions(question);

  if (!submissions) {
    redirect(`/courses/${params.courseId}`);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Grading Dashboard</h1>
        <Link href={`/courses/${params.courseId}`}>
          <Button variant="secondary">Return to course</Button>
        </Link>
      </div>
      <DataTableContainer submissions={submissions}></DataTableContainer>
    </div>
  );
}
