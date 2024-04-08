
/**
 * @jest-environment node
 */
import { GET } from '@/app/api/get-data/get-my-courses/route'
import { prismaMock } from '@/prisma-mock';
import { Role } from "@prisma/client";
import { NextRequest } from 'next/server';

describe('/api/get-data/get-my-courses/route', () => {
    test('should return status 500 when there is no email in the request object', async () => {
        const requestObj = {
            nextUrl: new URL('http://example.com')
        } as any;

        const response = await GET(requestObj);
        const body = await response.json();

        // Check the response
        expect(response.status).toBe(500);
        expect(body.message).toEqual('Invalid query parameter.');
    })

    test('should return status 500 when user is null', async () => {
        const requestObj = {
            nextUrl: new URL('http://example.com/?email=student@test.com')
        } as any;

        prismaMock.user.findUnique.mockResolvedValue(null)

        // Call the POST function
        const response = await GET(requestObj);
        const body = await response.json();

        // Check the response
        expect(response.status).toBe(500);
        expect(body.message).toEqual('User not found.');
    })

    test('should return status 500 when error is encountered', async () => {
        const requestObj = {
            nextUrl: new URL('http://example.com/?email=student@test.com')
        } as any;

        prismaMock.user.findUnique.mockRejectedValue(new Error())

        // Call the POST function
        const response = await GET(requestObj);

        // Check the response
        expect(response.status).toBe(500);
    })

    test('should return status 200 when courses are retrieved successfully', async () => {
        const requestObj = {
            nextUrl: new URL('http://example.com/?email=student@test.com')
        } as any;

        const student = {
            id: "1",
            email: 'student@test.com',
            password: 'password1',
            school_id: 'inst001',
            role: Role.STUDENT,
            created_courses: [],
            joined_courses: [],
        }

        prismaMock.user.findUnique.mockResolvedValue(student)

        // Call the POST function
        const response = await GET(requestObj);

        // Check the response
        expect(response.status).toBe(200);
    })

})