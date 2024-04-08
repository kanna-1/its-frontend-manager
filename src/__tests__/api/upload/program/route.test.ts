
/**
 * @jest-environment node
 */
import { POST } from '@/app/api/upload/program/route'
import { prismaMock } from '@/prisma-mock';
import { Role } from "@prisma/client";
import { NextRequest } from 'next/server';

describe('/api/upload/program/route', () => {
    test('should return status 500 when filename not in request object', async () => {
        const requestObj = {
            url: "http://example.com",
            method: "POST",
            headers: {
            }
        }

        const response = await POST(requestObj);
        const body = await response.json();

        // Check the response
        expect(response.status).toBe(500);
        expect(body.body).toEqual("Expected filename in url");
    })

    test('should return status 500 when file content not in request body', async () => {
        const requestObj = {
            url: "http://example.com/?filename=test.txt",
            method: "POST",
            headers: {
            }
        }

        const response = await POST(requestObj);
        const body = await response.json();

        // Check the response
        expect(response.status).toBe(500);
        expect(body.body).toEqual("Expected file content in request body");
    })

})