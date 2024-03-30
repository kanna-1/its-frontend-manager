import { getUserProps } from "@/actions/getUserProps";
import CourseCard from "@/components/cards/course-card";
import NewCourseDialog from "@/components/dialogs/newCourse";
import { Role } from "@prisma/client";
import Link from "next/link";

export default async function MyCourseView() {
  const user = await getUserProps({
    includeSchool: false,
    includeCourses: true,
    includeSubmissions: false,
  });
  const isTeacher = user.role === Role.TEACHER;

  return (
    <>
      <div className="flex space-x-4 items-center">
        <h1 className="text-xl font-semibold">My Courses</h1>
        {isTeacher && <NewCourseDialog user={user}></NewCourseDialog>}
      </div>
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-4 mt-4 p-4 border rounded-md min-h-[calc(100vh-160px)]">
        {isTeacher &&
          user.created_courses.map((course, index) => (
            <Link key={index} href={`/courses/${course.code}`}>
              <CourseCard course={course} isCreator={true} />
            </Link>
          ))}
        {user.joined_courses.map((course, index) => (
          <Link key={index} href={`/courses/${course.code}`}>
            <CourseCard course={course} isCreator={false} />
          </Link>
        ))}
      </div>
    </>
  );
}
