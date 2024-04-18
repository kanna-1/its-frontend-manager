import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Announcement, Question, Role } from "@prisma/client";
import { getCourseInfo } from "@/actions/getCourseInfo";
import { getUserProps } from "@/actions/getUserProps";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddMemberDialog from "@/components/dialogs/addMember";
import AnnouncementCard from "@/components/cards/announcementCard";
import DataTableContainer from "@/components/course-member-list/DataTableContainer";
import NewAnnouncementDialog from "@/components/dialogs/newAnnouncement";
import NewQuestionDialog from "@/components/dialogs/newQuestion";
import QuestionCard from "@/components/cards/questionCard";

export default async function CourseView({
  params,
}: {
  params: { courseId: string };
}): Promise<React.JSX.Element> {
  const user = await getUserProps({
    include_school: false,
    include_courses: false,
    include_submissions: false,
  });

  const course = await getCourseInfo({
    course_id: `${user.school_id}_${params.courseId}`,
  });
  if (!course) {
    redirect("/courses");
  }

  const courseQuestions: Question[] = course.questions;
  const courseAnnouncements: Announcement[] = course.announcements;
  const reversedAnnouncements = courseAnnouncements.slice().reverse();

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
              {user.role == Role.TEACHER && (
                <NewAnnouncementDialog user={user} course_id={course.id} />
              )}
            </div>
            <div className="mt-2 space-y-4">
              {reversedAnnouncements.map((announcement, index) => (
                <AnnouncementCard key={index} announcement={announcement} />
              ))}
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
              <div style={{ marginTop: 15 }}>
                <DataTableContainer
                  members={course.members}
                  courseId={course.id}
                  requestorEmail={user.email}
                />
              </div>
            </TabsContent>
          )}
        </div>
      </Tabs>
    </>
  );
}
