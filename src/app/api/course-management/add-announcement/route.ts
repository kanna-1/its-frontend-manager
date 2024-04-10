import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/course-management/add-announcement:
 *   post:
 *     description: |
 *       # Adds announcement to course
 *       Adds an announcement to a course, consisting of a title and body taken from input, visible to all members
 *       
 *       **Request format**  
 *       requestorEmail: string  
 *       courseId: string  
 *       title: string  
 *       body: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestorEmail:
 *                 type: string
 *                 example: "teacheremail@inst001.com"
 *               courseId:
 *                 type: string
 *                 example: "inst001_CS3213"
 *               title:
 *                 type: string
 *                 example: "Notice to all students"
 *               body:
 *                 type: string
 *                 example: "Classes are cancelled next Tuesday"
 *     responses:
 *       200:
 *         description: Successfully added announcement to course
 *         content:
 *           application/json:
 *             example:
 *               id: "announcement0000ugjkfcp30"
 *               title: "Notice to all students"
 *               body: "Classes are cancelled next Tuesday"
 *               time: "2024-04-10T07:06:32.556Z"
 *               course_id: "inst001_CS3213"
 *       403:
 *         description: Permission denied
 *         content:
 *           application/json:
 *             example:
 *               error: "You do not have the permission to make this request."
 *       404:
 *         description: Requestor or course not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid course ID."
 *       500:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             example:
 *               error: "Unexpected error occurred."
 */

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
