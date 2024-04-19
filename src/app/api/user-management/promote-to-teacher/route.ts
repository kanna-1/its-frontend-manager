import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/user-management/promote-to-teacher:
 *   post:
 *     description: |
 *       # Promotes a user to teacher role
 *       Changes role of user, specified by input email, to "teacher"
 *
 *       **Request format**
 *       email: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "teachertobe@test.com"
 *     responses:
 *       200:
 *         description: Successfully changed user's role to teacher
 *         content:
 *           application/json:
 *             example:
 *               promoted:
 *                 email: "teachertobe@test.com"
 *                 updatedrole: "TEACHER"
 *       404:
 *         description: Target user not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Not a valid user."
 *       500:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             example:
 *               error: "Unexpected error occurred."
 */

export async function POST(req: Request): Promise<
  | NextResponse<{
      promoted: {
        email: string;
        updatedrole: Role;
      };
    }>
  | NextResponse<{
      error: string;
    }>
> {
  try {
    const { email } = (await req.json()) as {
      email: string;
    };

    const requestor = await prisma.user.findUnique({
      where: {
        email: email,
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
    }

    const promote_to_teacher = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        role: "TEACHER",
      },
    });

    return NextResponse.json(
      {
        promoted: {
          email: promote_to_teacher.email,
          updatedrole: promote_to_teacher.role,
        },
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
