import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {sendPasswordResetEmail} from '@/lib/send-reset-email';
import { createPasswordResetToken } from '@/lib/tokens';

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as {
      email: string;

    };

    const user = await prisma.user.findUnique({
      where: {
          email: email.toLowerCase()
      }
    })

    if (!user) {
      return NextResponse.json({
        error: `User not found.`
      }, {
        status: 404
      });
    } else {
      // user exists
      const passwordResetToken = await createPasswordResetToken(user.email)
      const result = await sendPasswordResetEmail(user.email, passwordResetToken.token)
      return NextResponse.json({
        reset: {
          email: user.email,
        }
      }, {
        status: 200
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
