import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { requestorEmail, courseId, title, body } = (await req.json()) as {
      requestorEmail: string,
      courseId: string,
      title: string,
      body: string,
    };

    const requestor = await prisma.user.findUnique({
        where: {
            email: requestorEmail,
        },
        include: {
            created_courses: true,
            joined_courses: true,
        }
    })

    if (requestor == undefined || requestor == null) {
        return new NextResponse(
            JSON.stringify({
              status: 'error',
              message: 'Not a valid user.',
            }),
            { status: 500 }
          );
    }

    const inCourses = requestor.created_courses
        .concat(requestor.joined_courses)
        .map(course => course['id']);
    
    if (requestor.role !== 'TEACHER' || !inCourses.includes(courseId)) {
        return new NextResponse(
            JSON.stringify({
              status: 'error',
              message: 'You do not have the permission to make this request.',
            }),
            { status: 500 }
          );
    }

    const course = await prisma.course.findUnique({
        where: {
            id: courseId,
        },
    })

    if (course == undefined || course == null) {
        return new NextResponse(
            JSON.stringify({
              status: 'error',
              message: 'Invalid course ID.',
            }),
            { status: 500 }
          );
    }

    const announcement = await prisma.announcement.create({
        data: {
            title: title,
            body: body,
            course: {
                connect: {
                    id: courseId,
                }
            }
        }
    })

    return NextResponse.json({
      announcement
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
