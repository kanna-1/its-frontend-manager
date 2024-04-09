import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function POST(req: NextRequest) {
  try {
    const { email, password, institution } = (await req.json()) as {

      email: string;
      password: string;
      institution: string;
    };
    const hashed_password = await hash(password, 12);

    const duplicateUser = await prisma.user.findUnique({
      where: {
          email: email,
      }
    })

    if (duplicateUser !== null) {
      return NextResponse.json({
        error: 'This email address is already registered.'
      }, {
        status: 409
      });
    }

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashed_password,
        school_id: institution,
        role: 'STUDENT'
      },
    });

    return NextResponse.json({
      user: {
        email: user.email,
        school_id: user.school_id,
        role: user.role,
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
