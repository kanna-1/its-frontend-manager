import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * @swagger
 * /api/reset-password:
 *   post:
 *     description: |
 *       # Updates a user's password with input password
 *       Given a request token, resets a user's password by replacing it with input password
 *       
 *       **Request format**  
 *       password: string  
 *       token: string  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: "thH@2teRt0<>8!y"
 *               token:
 *                 type: string
 *                 example: "ff41266e-55d3-47fa-acc4-7ef51f9a5d69"
 *     responses:
 *       200:
 *         description: Successfully reset user's password
 *         content:
 *           application/json:
 *             example:
 *               user: 
 *                 email: "student1@test.com"
 *       404:
 *         description: Invalid token
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid password reset token."
 *       500:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             example:
 *               error: "Unexpected error occurred."
 */

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
