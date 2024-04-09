import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(req: Request) {
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

    // Delete the user based on the email
    const deletedUser = await prisma.user.delete({
      where: {
        email: email,
      },
    });

    return NextResponse.json({
      deleted: {
        email: deletedUser.email,
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
