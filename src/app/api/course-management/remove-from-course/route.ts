import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * @swagger
 * /api/course-management/remove-from-course:
 *   post:
 *     description: |
 *       # Removes user from course
 *       Removes the association of a user with input email from input course.
 *       
 *       **Request format**  
 *       courseId: string  
 *       userEmailToRemove: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: "inst001_CS3213"
 *               userEmailToRemove:
 *                 type: string
 *                 example: "student2@test.com"
 *     responses:
 *       200:
 *         description: Successfully removed user from course
 *         content:
 *           application/json:
 *             example:
 *               message: "User student2@test.com removed from the course."
 *       404:
 *         description: Targer user or course not found
 *         content:
 *           application/json:
 *             example:
 *               error: "User with email: student2@test.com does not exist."
 *       500:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             example:
 *               error: "Unexpected error occurred."
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
      return NextResponse.json({
        error: 'Invalid course ID.'
      }, {
        status: 404
      });
    }

    const userToRemove = await prisma.user.findUnique({
      where: {
        email: userEmailToRemove,
      },
    });

    if (!userToRemove) {
      return NextResponse.json({
        error: `User with email: ${userEmailToRemove} does not exist.`
      }, {
        status: 404
      });
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
      message: `User ${userEmailToRemove} removed from the course.`,
    }, {
      status: 200
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, {
      status: 500
    });
  }
}
