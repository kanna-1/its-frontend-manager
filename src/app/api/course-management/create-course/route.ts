import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

// example usage:
// const reqdata = {
//    user_id: user.id,
//    user_role: user.role,
//    school_id: user.school_id,
//    code: values.code.toUpperCase(),
//    name: values.name,
// };

// const res4 = await fetch(process.env.URL + '/api/course-management/create-course', {
//     method: 'POST',
//     body: JSON.stringify(reqdata),
// });

// const resbody = await res4.json();

// console.log(resbody);

/**
 * @swagger
 * /api/course-management/create-course:
 *   post:
 *     description: Creates course
 *     responses:
 *       200:
 *         description: The created course
 */

export async function POST(req: Request) {
  try {
    const { user_id, user_role, school_id, code, name } =
      (await req.json()) as {
        user_id: string;
        user_role: Role;
        school_id: string;
        code: string;
        name: string;
      };

    if (user_role !== Role.TEACHER) {
      return NextResponse.json({
        error: 'You do not have the permission to make this request.'
      }, {
        status: 403
      });
    }

    const courseId = school_id + "_" + code;

    const duplicateCourse = await prisma.course.findUnique({
        where: {
            id: courseId,
        }
    })

    if (duplicateCourse !== null) {
      return NextResponse.json({
        error: 'Course already exists.'
      }, {
        status: 409
      });
    }

    const courseToCreate = await prisma.course.create({
      data: {
        id: school_id + "_" + code,
        code: code,
        name: name,
        creator_id: user_id,
        school_id: school_id,
      },
    });

    return NextResponse.json({
      courseToCreate
    }, {
      status: 200
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
