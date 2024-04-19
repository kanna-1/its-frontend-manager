import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/course-management/remove-from-course:
 *   post:
 *     description: |
 *       # Removes user from course
 *       Removes the association of a user with input email from input course.
 *
 *       **Request format**
 *       course_id: string
 *       user_email_to_remove: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course_id:
 *                 type: string
 *                 example: "inst001_CS3213"
 *               user_email_to_remove:
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

export async function POST(req: Request): Promise<
  | NextResponse<{
      message: string;
    }>
  | NextResponse<{
      error: string;
    }>
> {
  try {
    const { course_id, user_email_to_remove } = (await req.json()) as {
      course_id: string;
      user_email_to_remove: string;
    };

    const course = await prisma.course.findUnique({
      where: {
        id: course_id,
      },
    });

    if (!course) {
      return NextResponse.json(
        {
          error: "Invalid course ID.",
        },
        {
          status: 404,
        }
      );
    }

    const user_to_remove = await prisma.user.findUnique({
      where: {
        email: user_email_to_remove,
      },
    });

    if (!user_to_remove) {
      return NextResponse.json(
        {
          error: `User with email: ${user_email_to_remove} does not exist.`,
        },
        {
          status: 404,
        }
      );
    }

    await prisma.user.update({
      where: {
        email: user_email_to_remove,
      },
      data: {
        joined_courses: {
          disconnect: {
            id: course_id,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: `User ${user_email_to_remove} removed from the course.`,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
