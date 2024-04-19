import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/user-management/bulk-promote-to-teacher:
 *   post:
 *     summary: UNUSED
 *     description: |
 *       # (UNUSED) Promotes multiple users to teacher role
 *       Changes role of all specified users in the input list of emails, to "teacher"
 *
 *       **Request format**
 *       emails: string[]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emails:
 *                 type: string[]
 *                 example: ["teachertobe1@test.com", "teachertobe2@test.com"]
 *     responses:
 *       200:
 *         description: Successfully changed users' role to teacher
 *         content:
 *           application/json:
 *             example:
 *               promoteToTeachers:
 *                 count: 2
 *       500:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             example:
 *               error: "Unexpected error occurred."
 */

export async function POST(req: Request): Promise<
  | NextResponse<{
      promoteToTeachers: Prisma.BatchPayload;
    }>
  | NextResponse<{
      error: string;
    }>
> {
  try {
    const { emails } = (await req.json()) as {
      emails: string[];
    };

    const promoteToTeachers = await prisma.user.updateMany({
      where: {
        email: {
          in: emails,
        },
      },
      data: {
        role: "TEACHER",
      },
    });

    return NextResponse.json(
      {
        promoteToTeachers,
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
