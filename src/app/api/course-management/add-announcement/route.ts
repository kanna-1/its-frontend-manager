import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { requestorEmail, courseId, title, body } = (await req.json()) as {
      requestorEmail: string;
      courseId: string;
      title: string;
      body: string;
    };

    const requestor = await prisma.user.findUnique({
      where: {
        email: requestorEmail,
      },
      include: {
        created_courses: true,
        joined_courses: true,
      },
    });

    if (requestor == undefined || requestor == null) {
      return NextResponse.json({
        error: 'Not a valid user.'
      }, {
        status: 404
      });
    }

    const inCourses = requestor.created_courses
      .concat(requestor.joined_courses)
      .map((course) => course["id"]);

    if (requestor.role !== "TEACHER" || !inCourses.includes(courseId)) {
      return NextResponse.json({
        error: 'You do not have the permission to make this request.'
      }, {
        status: 403
      });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (course == undefined || course == null) {
      return NextResponse.json({
        error: 'Invalid course ID.'
      }, {
        status: 404
      });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title: title,
        body: body,
        course: {
          connect: {
            id: courseId,
          },
        },
      },
    });

    return NextResponse.json({
        announcement,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, {
      status: 500
    });
  }
}
