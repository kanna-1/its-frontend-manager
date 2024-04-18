"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Course, Question, Submission, User } from "@prisma/client";
import { getCodeFeedback } from "@/actions/getCodeFeedback";
import { createSubmission } from "@/actions/createSubmission";
import { Button, LoadingButton } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import QuestionViewFeedback, { FeedbackType } from "@/components/question-view/QuestionViewFeedback";
import QuestionViewEditor from "@/components/question-view/QuestionViewEditor";
import { PutBlobResult } from "@vercel/blob";

export default function QuestionViewContainer({
  user,
  question,
}: {
  user: User;
  question: Question & { course: Course; submissions: Submission[] };
}): React.JSX.Element {
  const router = useRouter();
  const { toast } = useToast();
  const [editorContent, setEditorContent] = useState("");
  const [shouldApplyDecorations, setShouldApplyDecorations] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);

  const handleEditorChange = (value: string | undefined): void => {
    setEditorContent(value || "");
    setShouldApplyDecorations(false);
  };

  const handleFeedback = async (): Promise<void> => {
    setIsChecking(true);
    const { status, feedback } = await getCodeFeedback({
      question: question,
      student_solution: editorContent,
    });

    if (status) {
      toast({
        title: status,
        variant: "destructive",
      });
    } else {
      setFeedbacks(feedback.sort((a, b) => a.lineNumber - b.lineNumber));
      setShouldApplyDecorations(true);
    }
    setIsChecking(false);
  };

  const handleSubmission = async (): Promise<void> => {
    setIsSubmitting(true);
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

      if (!response.ok) {
        const message = (await response.json()).error;
        throw new Error(message);
      }

      const newBlob = (await response.json()) as PutBlobResult;

      const newSubmission = await createSubmission({
        user: user,
        question: question,
        student_solution_url: newBlob.url,
      });

      if (!newSubmission) {
        throw new Error("Unable to create new submission");
      }

      toast({
        title: "Submission Successful",
        description: "Redirecting back to your course.",
        variant: "success",
      });

      router.push(
        `/courses/${question.course.code}/${question.id}/${newSubmission.id}`
      );
    } catch (error) {
      console.error(error);
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
          <div className="h-1/6 flex items-end pb-6">
            <Link href={`/courses/${question.course.code}`}>
              <Button variant="secondary">Return to course</Button>
            </Link>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70}>
        <div className="h-full">
          <div className="h-1/2">
            <QuestionViewEditor
              language={question.language}
              handleEditorChange={handleEditorChange}
              feedback={feedbacks}
              shouldApplyDecorations={shouldApplyDecorations}
            />
          </div>
          <Separator />
          <div className="flex flex-col justify-between h-1/2 mt-4">
            <QuestionViewFeedback feedbacks={feedbacks} />
            <div className="flex h-1/4 items-start justify-end">
              <LoadingButton
                loading={isChecking}
                className="mr-2"
                onClick={() => handleFeedback()}
              >
                Run Check
              </LoadingButton>
              <LoadingButton
                loading={isSubmitting}
                onClick={() => handleSubmission()}
              >
                Submit Code
              </LoadingButton>
            </div>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
