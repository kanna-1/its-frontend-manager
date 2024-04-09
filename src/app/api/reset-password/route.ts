import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { password, token } = (await req.json()) as {
      password: string;
      token: string;
    };

    const hashed_password = await hash(password, 12);
    const resetToken = await prisma.passwordResetToken.findUnique({
        where : { token : token}
    })

    if (resetToken) {
      const changePassword = await prisma.user.update({
        where: {
          email: resetToken.email,
        },
        data: {
          password: hashed_password,
        }
      });

      return NextResponse.json({
        user: {
          email: resetToken.email
        },
      }, {
        status: 200
      });
    } else {
      return NextResponse.json({
        error: 'Invalid password reset token.'
      }, {
        status: 404
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, {
      status: 500
    });
  }
}
