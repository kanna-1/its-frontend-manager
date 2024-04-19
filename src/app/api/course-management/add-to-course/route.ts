import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/course-management/add-to-course:
 *   post:
 *     description: |
 *       # Add users to course
 *       Associates users, defined by input list of emails, to a specified course.
 *
 *       **Request format**
 *       requestor_email: string
 *       course_id: string
 *       emails_to_add: string[]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestor_email:
 *                 type: string
 *                 example: "teacheremail@inst001.com"
 *               course_id:
 *                 type: string
 *                 example: "inst001_CS3213"
 *               emails_to_add:
 *                 type: string[]
 *                 example: ["studentemail1@inst001.com", "studentemail2@inst001.com"]
 *     responses:
 *       200:
 *         description: Successfully added users to course
 *         content:
 *           application/json:
 *             example:
 *               addedUsers: ["student2@test.com", "student3@test.com"]
 *       403:
 *         description: Permission denied
 *         content:
 *           application/json:
 *             example:
 *               error: "You do not have the permission to make this request."
 *       404:
 *         description: Requestor, course or requested users not found
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
      addedUsers: string[];
    }>
  | NextResponse<{
      error: string;
    }>
> {
  try {
    const { requestor_email, course_id, emails_to_add } =
      (await req.json()) as {
        requestor_email: string;
        course_id: string;
        emails_to_add: string[];
      };

    const requestor = await prisma.user.findUnique({
      where: {
        email: requestor_email,
      },
    });

    if (requestor == undefined || requestor == null) {
      return NextResponse.json(
        {
          error: "Not a valid user.",
        },
        {
          status: 404,
        }
      );
    } else if (requestor.role !== "TEACHER") {
      return NextResponse.json(
        {
          error: "You do not have the permission to make this request.",
        },
        {
          status: 403,
        }
      );
    }

    const course = await prisma.course.findUnique({
      where: {
        id: course_id,
      },
    });

    if (course == undefined || course == null) {
      return NextResponse.json(
        {
          error: "Invalid course ID.",
        },
        {
          status: 404,
        }
      );
    }

    const added_users: string[] = [];

    for (const email of emails_to_add) {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        return NextResponse.json(
          {
            error: `User with email: ${email} does not exist.`,
          },
          {
            status: 404,
          }
        );
      }

      const added = await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          joined_courses: {
            connect: {
              id: course_id,
            },
          },
        },
      });

      if (added !== null && added.email !== null) {
        added_users.push(added.email);
      }
    }

    return NextResponse.json(
      {
        addedUsers: added_users,
      },
      { status: 200 }
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
