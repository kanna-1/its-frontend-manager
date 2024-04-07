/**
 * @jest-environment node
 */
import { POST } from '@/app/api/forgot-password/route'
import { prismaMock } from '@/prisma-mock';
import { Role } from "@prisma/client";
import { createPasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/send-reset-email";


describe('/api/forgot-password/route', () => {
    test('should return status 200 when user can forget password', async () => {

        const passwordResetToken = {
            id: "1",
            email: "student1@test.com",
            token: "token",
            expires: new Date()
        }

        // Mock createPasswordResetToken
        jest.mock('@/lib/tokens', () => ({
            createPasswordResetToken: jest.fn().mockResolvedValue(null),
        }))

        // Mock sendPasswordResetEmail
        jest.mock('@/lib/send-reset-email', () => ({
            sendPasswordResetEmail: jest.fn().mockResolvedValue(null),
        }));

        const requestObj = {
            json: async () => ({
                email: "student1@test.com"
            }), } as any

        const student = {
            id: "2",
            email: 'student1@test.com',
            password: 'password1',
            school_id: 'inst001',
            role: Role.STUDENT,
        }

        prismaMock.user.findUnique.mockResolvedValue(student)


        // Call the POST function
        const response = await POST(requestObj);
        const body = await response.json();

        // Check the response
        const expected_response = {
            user: {
                email: 'student1@test.com',
            }
        }
        expect(response.status).toBe(200);
        // expect(body).toEqual(expected_response);

    })

    // test('should return status 500 when reset password is null', async () => {

    //     const requestObj = {
    //         json: async () => ({
    //             password: "password123",
    //             token: "token123"
    //         }), } as any

    //     prismaMock.passwordResetToken.findUnique.mockResolvedValue(null)

    //     // Call the POST function
    //     const response = await POST(requestObj);
    //     const body = await response.json();

    //     expect(response.status).toBe(500);
    //     expect(body.message).toEqual("Null password reset token");

    // })

})