import { getQuestionInfo } from "@/actions/getQuestionInfo";
import { getUserProps } from "@/actions/getUserProps";
import QuestionViewContainer from "@/components/question-view/QuestionViewContainer";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function QuestionView({
  params,
}: {
  params: { questionId: string; courseId: string };
}) {
  const user = await getUserProps({
    includeSchool: false,
    includeCourses: false,
    includeSubmissions: true,
  });

  const question = await getQuestionInfo({
    questionId: params.questionId,
    courseId: params.courseId.toUpperCase(),
    schoolId: user.school_id,
  });

  if (!question || user.role === Role.TEACHER) {
    redirect(`/courses/${params.courseId}`);
  }

  const submission = user.submissions.findIndex(
    (submission) => submission.question_id === question.id
  );
  if (submission === -1) {
    return (
      <QuestionViewContainer
        question={question}
        user={user}
      ></QuestionViewContainer>
    );
  } else {
    redirect(
      `/courses/${params.courseId}/${question.id}/${user.submissions[submission].id}`
    );
  }
}
