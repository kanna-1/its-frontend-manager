import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/upload/question:
 *   post:
 *     description: |
 *       # Creates a new question for a course
 *       Creates a new question under a course. Note that this should only be called after uploading the reference solution program file to `/api/upload/program?filename=`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 required: true
 *               description:
 *                 type: string
 *                 required: true
 *               language:
 *                 type: string
 *                 required: true
 *               entry_function:
 *                 type: string
 *                 required: true
 *               io_input:
 *                 type: string
 *                 required: true
 *               func_args:
 *                 type: string
 *                 required: true
 *               courseId:
 *                 type: string
 *                 description: The id of the course where the question belongs.
 *               reference_program:
 *                 type: string
 *                 description: The URL of the uploaded reference program associated with the question.
 *     responses:
 *       200:
 *         description: Successful question creation. Returns the newly created question object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 language:
 *                   type: string
 *                 entry_function:
 *                   type: string
 *                 io_input:
 *                   type: string
 *                 func_args:
 *                   type: string
 *                 reference_program:
 *                   type: string
 *                 courseId:
 *                   type: string
 *       400:
 *         description: Bad request (missing required fields, invalid data)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { reference_program, courseId, ...content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Expected question content." },
        { status: 400 }
      );
    }

    if (!courseId) {
      return NextResponse.json(
        { error: "Expected course id." },
        { status: 400 }
      );
    }

    if (!reference_program) {
      return NextResponse.json(
        { error: "Expected reference program id. Please upload the reference program first." },
        { status: 400 }
      );
    }

    const question = await prisma.question.create({
      data: {
        ...content,
        reference_program: reference_program,
        course: {
          connect: { id: courseId },
        },
      },
    });

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        questions: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Unable to find course" },
        { status: 404 }
      );
    }

    await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        questions: {
          set: [...course.questions, question],
        },
      },
    });

    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
