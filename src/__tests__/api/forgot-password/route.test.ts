/**
 * @jest-environment node
 */
import { POST } from '@/app/api/forgot-password/route'
import { prismaMock } from '@/prisma-mock';
import { Role } from "@prisma/client";

describe('/api/forgot-password/route', () => {
    beforeEach(() => {
        jest.clearAllMocks();
      });
    test('should return status 200 when user can forget password', async () => {

        jest.restoreAllMocks()
        const passwordResetToken = {
            id: "1",
            email: "student1@test.com",
            token: "token",
            expires: new Date()
        }

        // Mock createPasswordResetToken
        jest.mock('@/lib/tokens', () => ({
            createPasswordResetToken: jest.fn().mockResolvedValue(passwordResetToken),
        }))

        // Mock sendPasswordResetEmail
        jest.mock('@/lib/send-reset-email', () => ({
            sendPasswordResetEmail: jest.fn().mockReturnValue(new Promise((resolve, reject) => {resolve("Email sent")})),
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
            reset: {
                email: 'student1@test.com',
            }
        }

    })

    test('should return status 500 when user is not found', async () => {
        const requestObj = {
            json: async () => ({
                email: ""
            }), } as any

        prismaMock.user.findUnique.mockResolvedValue(null)

        // Call the POST function
        const response = await POST(requestObj);

        expect(response.status).toBe(500);
    })

    test('should return status 500 when error is encountered', async () => {
        const requestObj = {
            json: async () => ({
                email: ""
            }), } as any

        prismaMock.user.findUnique.mockRejectedValue(new Error())

        // Call the POST function
        const response = await POST(requestObj);

        expect(response.status).toBe(500);
    })

})