import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/user-management/delete-row:
 *   delete:
 *     description: |
 *       # Delete a user
 *       Permanently removes a user, specified by input email, from the system
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
 *                 example: "usertobedeleted@test.com"
 *     responses:
 *       200:
 *         description: Successfully changed user's role to teacher
 *         content:
 *           application/json:
 *             example:
 *               deleted:
 *                 email: "usertobedeleted@test.com"
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

export async function DELETE(req: Request): Promise<
  | NextResponse<{
      deleted: {
        email: string;
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

    // Delete the user based on the email
    const deleted_user = await prisma.user.delete({
      where: {
        email: email,
      },
    });

    return NextResponse.json(
      {
        deleted: {
          email: deleted_user.email,
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
