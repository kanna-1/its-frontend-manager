import React from "react";
import Link from "next/link";
import { Role } from "@prisma/client";
import { getUserProps } from "@/actions/getUserProps";
import CourseCard from "@/components/cards/courseCard";
import NewCourseDialog from "@/components/dialogs/newCourse";

export default async function MyCourseView(): Promise<React.JSX.Element> {
  const user = await getUserProps({
    include_school: false,
    include_courses: true,
    include_submissions: false,
  });
  const isTeacher = user.role === Role.TEACHER;

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">My Courses</h1>
        {isTeacher && <NewCourseDialog user={user}></NewCourseDialog>}
      </div>
      <div className="mt-4 p-4 border rounded-md min-h-[calc(100vh-160px)]">
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
          {isTeacher &&
            user.created_courses.map((course, index) => (
              <Link key={index} href={`/courses/${course.code}`}>
                <CourseCard key={index} course={course} isCreator={true} />
              </Link>
            ))}
          {user.joined_courses.map((course, index) => (
            <Link key={index} href={`/courses/${course.code}`}>
              <CourseCard key={index} course={course} isCreator={false} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
