import { getCourseInfo } from "@/actions/getCourseInfo";
import { getUserProps } from "@/actions/getUserProps";
import QuestionCard from "@/components/cards/question-card";
import AddMemberDialog from "@/components/dialogs/addMember";
import NewQuestionDialog from "@/components/dialogs/newQuestion";
import DataTableContainer from "@/components/course-member-list/DataTableContainer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Question, Role, User } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from '@/lib/auth';

export default async function CourseView({
  params,
}: {
  params: { courseId: string };
}) {
  const user = await getUserProps({
    includeSchool: false,
    includeCourses: false,
    includeSubmissions: false,
  });

  const course = await getCourseInfo({
    courseId: `${user.school_id}_${params.courseId}`,
  });
  if (!course) {
    redirect("/courses");
  }

  const courseQuestions: Question[] = course.questions;
  const courseMembers: User[] = course.members;
  return (
    <>
      <h1 className="text-2xl font-semibold">
        {params.courseId} <span className="font-light">{course.name}</span>
      </h1>
      <Tabs defaultValue="home" className="flex flex-row mt-4 space-x-8">
        <TabsList className="w-32">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          {user.role == Role.TEACHER && (
            <TabsTrigger value="people">People</TabsTrigger>
          )}
        </TabsList>
        <div className="w-full">
          <TabsContent value="home">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium">Announcements</h3>
              <Button variant="secondary">New Announcement</Button>
            </div>
          </TabsContent>
          <TabsContent value="questions">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium">Manage Questions</h3>
              {user.role == Role.TEACHER && (
                <NewQuestionDialog courseId={course.id} />
              )}
            </div>
            <div className="grid grid-cols-4 gap-4 mt-2">
              {courseQuestions.map((question, index) => (
                <Link
                  key={index}
                  href={
                    user.role === Role.TEACHER
                      ? `/courses/${params.courseId}/${question.id}/grading`
                      : `/courses/${params.courseId}/${question.id}`
                  }
                >
                  <QuestionCard
                    question_title={question.title}
                    question_description={question.description}
                  />
                </Link>
              ))}
            </div>
          </TabsContent>
          {user.role == Role.TEACHER && (
            <TabsContent value="people">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium">
                  Manage Teachers & Students
                </h3>
                <AddMemberDialog user={user} course={course}></AddMemberDialog>
              </div>
              <div style={{ marginTop: 15}}>
                <DataTableContainer  members={course.members} courseId={course.id} requestorEmail={user.email}/>
              </div>
            </TabsContent>
          )}
        </div>
      </Tabs>
    </>
  );
}
