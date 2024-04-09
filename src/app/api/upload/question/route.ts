import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Creates a new question
 * @param request
 * @returns the new question
 * Retrieve question id using data.id
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
