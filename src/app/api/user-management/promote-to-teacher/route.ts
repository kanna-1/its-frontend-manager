import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// example usage:
// const emaildata = {
//     email: 'test1@test.com',
// };

// const res1 = await fetch(process.env.URL + '/api/user-management/promote-to-teacher', {
//     method: 'POST',
//     body: JSON.stringify(emaildata),
// });

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as {
      email: string;
    };

    const requestor = await prisma.user.findUnique({
      where: {
          email: email,
      },
    })

    if (requestor == undefined || requestor == null) {
      return NextResponse.json({
        error: 'Not a valid user.'
      }, {
        status: 404
      });
    }

    const promoteToTeacher = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        role: 'TEACHER',
      }
    });

    return NextResponse.json({
      promoted: {
        email: promoteToTeacher.email,
        updatedrole: promoteToTeacher.role,
      },
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

