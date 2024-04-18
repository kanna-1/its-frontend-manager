"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { setSubmissionFeedback } from "@/actions/setSubmissionFeedback";
import { setSubmissionGrade } from "@/actions/setSubmissionGrade";
import { Course, Question, Role, Submission, User } from "@prisma/client";
import { Button, LoadingButton } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import SubmissionViewEditor from "@/components/submission-view/SubmissionViewEditor";
import SubmissionViewFeedback from "@/components/submission-view/SubmissionViewFeedback";

const formSchema = z.object({
  feedback: z.string(),
  grade: z.number(),
});

export default function SubmissionViewContainer({
  submission,
  question,
  user,
  code,
}: {
  submission: Submission;
  question: Question & { course: Course };
  user: User;
  code: string;
}): React.JSX.Element {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feedback: submission.feedback || "",
      grade: submission.grade < 0 ? 0 : submission.grade,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
    try {
      await setSubmissionFeedback({
        submission_id: submission.id,
        feedback: values.feedback,
      });

      await setSubmissionGrade({
        submission_id: submission.id,
        grade: values.grade,
      });

      router.push(`/courses/${question.course.code}/${question.id}/grading`);
    } catch (error) {
      console.error(error);
    }
  }

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
            {user.role === Role.TEACHER ? (
              <Link
                href={`/courses/${question.course.code}/${question.id}/grading`}
              >
                <Button variant="secondary">Return to grading dashboard</Button>
              </Link>
            ) : (
              <Link href={`/courses/${question.course.code}`}>
                <Button variant="secondary">Return to course</Button>
              </Link>
            )}
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70}>
        <div className="h-full">
          <div className="h-4/6">
            <SubmissionViewEditor code={code} />
          </div>
          <Separator />
          {user.role === Role.TEACHER ? (
            <div className="h-2/6 pl-4 pt-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2"
                >
                  <FormField
                    control={form.control}
                    name="feedback"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Feedback</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            disabled={form.formState.isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-row space-x-2 items-end justify-between">
                    <FormField
                      control={form.control}
                      name="grade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              disabled={form.formState.isSubmitting}
                              onChange={(value) =>
                                field.onChange(value.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <LoadingButton
                      type="submit"
                      loading={form.formState.isSubmitting}
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? "Submitting..." : "Submit"}
                    </LoadingButton>
                  </div>
                </form>
              </Form>
            </div>
          ) : (
            <div className="h-2/6 pl-4 pt-4">
              <SubmissionViewFeedback
                feedback={submission.feedback}
                grade={submission.grade}
              />
            </div>
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
