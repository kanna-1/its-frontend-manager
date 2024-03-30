"use client";

import Link from "next/link";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import QuestionViewEditor from "@/components/question-view/QuestionViewEditor";
import QuestionViewFeedback, {
  FeedbackType,
} from "@/components/question-view//QuestionViewFeedback";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getCodeFeedback } from "@/actions/getCodeFeedback";
import { Course, Question, Submission, User } from "@prisma/client";
import { createSubmission } from "@/actions/createSubmission";
import { useRouter } from "next/navigation";
import { PutBlobResult } from "@vercel/blob";
import { Separator } from "@/components/ui/separator";

export default function QuestionViewContainer({
  user,
  question,
}: {
  user: User;
  question: Question & { course: Course; submissions: Submission[] };
}) {
  const router = useRouter();
  const [editorContent, setEditorContent] = useState("");
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
  const handleEditorChange = (value: string | undefined) => {
    setEditorContent(value || "");
  };

  const handleSubmission = async () => {
    try {
      const solFile = new File(
        [editorContent],
        `${user.id}_${question.id}.${question.language}`,
        { type: "text/plain" }
      );
      const response = await fetch(
        `/api/upload/program?filename=${solFile.name}`,
        {
          method: "POST",
          body: solFile,
        }
      );

      const newBlob = (await response.json()) as PutBlobResult;

      const newSubmission = await createSubmission({
        user: user,
        question: question,
        student_solution_url: newBlob.url,
      });

      if (!newSubmission) {
        throw new Error("Unable to create new submission");
      }

      router.push(
        `/courses/${question.course.code}/${question.id}/${newSubmission.id}`
      );
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[calc(100vh-100px)]"
    >
      <ResizablePanel defaultSize={30}>
        <div className="pr-4 h-full">
          <div className="h-5/6 flex flex-col space-y-2">
            <h1 className="text-2xl font-semibold">{question.title}</h1>
            <p>{question.description}</p>
          </div>
          <div className="h-1/6 flex items-end pb-4">
            <Link href={`/courses/${question.course.code}`}>
              <Button variant="secondary">Return to course</Button>
            </Link>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70}>
        <div className="h-full">
          <div className="h-4/6">
            <QuestionViewEditor
              language={question.language}
              handleEditorChange={handleEditorChange}
            />
          </div>
          <Separator />
          <div className="h-1/6">
            <QuestionViewFeedback feedbacks={feedbacks} />
          </div>
          <div className="h-1/6 flex items-end justify-end pb-4">
            <Button
              className="mr-2"
              onClick={async () =>
                await getCodeFeedback({
                  question: question,
                  student_solution: editorContent,
                }).then((feedbacks) => setFeedbacks(feedbacks))
              }
            >
              Run Check
            </Button>
            <Button onClick={() => handleSubmission()}>Submit Code</Button>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
