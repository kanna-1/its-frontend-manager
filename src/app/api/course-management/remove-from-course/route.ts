import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/*
Example Usage:

const res = await fetch('/api/course-management/remove-from-course', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    courseId: course.id,
    userEmailToRemove: selectedUser
  })
});

*/

export async function POST(req: Request) {
  try {
    const { courseId, userEmailToRemove } = (await req.json()) as {
      courseId: string,
      userEmailToRemove: string,
    };

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return new NextResponse(
        JSON.stringify({
          status: 'error',
          message: 'Invalid course ID.',
        }),
        { status: 404 } 
      );
    }

    const userToRemove = await prisma.user.findUnique({
      where: {
        email: userEmailToRemove,
      },
    });

    if (!userToRemove) {
      return new NextResponse(
        JSON.stringify({
          status: 'error',
          message: `User with email: ${userEmailToRemove} does not exist.`,
        }),
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: {
        email: userEmailToRemove,
      },
      data: {
        joined_courses: {
          disconnect: {
            id: courseId,
          },
        },
      },
    });

    return NextResponse.json({
      status: 'success',
      message: `User ${userEmailToRemove} removed from the course.`,
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
