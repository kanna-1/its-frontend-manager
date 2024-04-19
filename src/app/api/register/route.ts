import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/register:
 *   post:
 *     description: |
 *       # Register a user
 *       Registers a user within the system with the input details.
 *
 *       **Request format**
 *       email: string
 *       password: string
 *       institution: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "student1@test.com"
 *               password:
 *                 type: string
 *                 example: "thH@2teRt0<>8!y"
 *               institution:
 *                 type: string
 *                 example: "inst001"
 *     responses:
 *       200:
 *         description: Successfully registered user
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 email: "student1@test.com"
 *                 school_id: "inst001"
 *                 role: "STUDENT"
 *       409:
 *         description: Email is already registered in the system
 *         content:
 *           application/json:
 *             example:
 *               error: "This email address is already registered."
 *       500:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             example:
 *               error: "Unexpected error occurred."
 */

export async function POST(req: NextRequest): Promise<
  | NextResponse<{
      user: {
        email: string;
        school_id: string;
        role: Role;
      };
    }>
  | NextResponse<{
      error: string;
    }>
> {
  try {
    const { email, password, institution } = (await req.json()) as {
      email: string;
      password: string;
      institution: string;
    };
    const hashed_password = await hash(password, 12);
    const duplicate_user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (duplicate_user !== null) {
      return NextResponse.json(
        {
          error: "This email address is already registered.",
        },
        {
          status: 409,
        }
      );
    }

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashed_password,
        school_id: institution,
        role: "STUDENT",
      },
    });

    return NextResponse.json(
      {
        user: {
          email: user.email,
          school_id: user.school_id,
          role: user.role,
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
