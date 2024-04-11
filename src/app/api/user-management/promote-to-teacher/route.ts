import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * @swagger
 * /api/user-management/promote-to-teacher:
 *   post:
 *     description: |
 *       # Promotes a user to teacher role
 *       Changes role of user, specified by input email, to "teacher"
 *       
 *       **Request format**  
 *       email: string  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "teachertobe@test.com"
 *     responses:
 *       200:
 *         description: Successfully changed user's role to teacher
 *         content:
 *           application/json:
 *             example:
 *               promoted: 
 *                 email: "teachertobe@test.com"
 *                 updatedrole: "TEACHER"
 *       404:
 *         description: Target user not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Not a valid user."
 *       500:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             example:
 *               error: "Unexpected error occurred."
 */

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

