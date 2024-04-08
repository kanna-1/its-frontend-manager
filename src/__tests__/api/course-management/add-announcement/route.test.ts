
/**
 * @jest-environment node
 */
import { POST } from '@/app/api/course-management/add-announcement/route'
import { prismaMock } from '@/prisma-mock';
import { Role } from "@prisma/client";

describe('/api/course-management/add-announcement/route', () => {
    test('should return status 500 as requestor is null', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)

      const requestObj = {
        json: async () => ({
            requestorEmail: "student@test.com",
            courseId: "inst001_CS3213",
            title: "Announcement",
            body: "This is an announcement"
        }), } as any

      // Call the POST function
      const response = await POST(requestObj);
      const body = await response.json();

      // Check the response
      expect(response.status).toBe(500);
      expect(body.message).toEqual('Not a valid user.');

    })

    test('should return status 500 as requestor is student', async () => {

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

        const requestObj = {
            json: async () => ({
                requestorEmail: "student@test.com",
                courseId: "inst001_CS3213",
                title: "Announcement",
                body: "This is an announcement"
            }), } as any

        // Call the POST function
        const response = await POST(requestObj);
        const body = await response.json();

        // Check the response
        expect(response.status).toBe(500);
        expect(body.message).toEqual('You do not have the permission to make this request.');

    })

    test('should return status 500 as course is not found', async () => {
        const course = {
            id: "inst001_CS3213",
            code: "CS3213",
            name: "Foundations of Software Engineering",
            creator_id: 'teacher@test.com',
            school_id: 'inst001',
        }

        const student = {
            id: "1",
            email: 'teacher@test.com',
            password: 'password1',
            school_id: 'inst001',
            role: Role.TEACHER,
            created_courses: [course],
            joined_courses: [],
        }

        prismaMock.user.findUnique.mockResolvedValue(student)
        prismaMock.course.findUnique.mockResolvedValue(null)

        const requestObj = {
            json: async () => ({
                requestorEmail: "teacher@test.com",
                courseId: "inst001_CS3213",
                title: "Announcement",
                body: "This is an announcement"
            }), } as any

        // Call the POST function
        const response = await POST(requestObj);
        const body = await response.json();

        // Check the response
        expect(response.status).toBe(500);
        expect(body.message).toEqual('Invalid course ID.');

    })

    test('should return status 200 when announcement is successfully created', async () => {

        const course = {
            id: "inst001_CS3213",
            code: "CS3213",
            name: "Foundations of Software Engineering",
            creator_id: 'teacher@test.com',
            school_id: 'inst001',
        }

        const student = {
            id: "1",
            email: 'teacher@test.com',
            password: 'password1',
            school_id: 'inst001',
            role: Role.TEACHER,
            created_courses: [course],
            joined_courses: [],
        }


        const announcement = {
            id: "1",
            title: "Announcement",
            body: "This is an announcement",
            time: new Date(),
            course_id: "inst001_CS3213"
        }
        prismaMock.user.findUnique.mockResolvedValue(student)
        prismaMock.course.findUnique.mockResolvedValue(course)
        prismaMock.announcement.create.mockResolvedValue(announcement)

        const requestObj = {
            json: async () => ({
                requestorEmail: "teacher@test.com",
                courseId: "inst001_CS3213",
                title: "Announcement",
                body: "This is an announcement"
            }), } as any

        // Call the POST function
        const response = await POST(requestObj);
        const body = await response.json();

        // Check the response
        expect(response.status).toBe(200);
    })

    test('should return status 500 when error is encountered', async () => {
        prismaMock.user.findUnique.mockRejectedValue(new Error())

        const requestObj = {
            json: async () => ({
                requestorEmail: "teacher@test.com",
                courseId: "inst001_CS3213",
                title: "Announcement",
                body: "This is an announcement"
            }), } as any

        // Call the POST function
        const response = await POST(requestObj);
        const body = await response.json();

        // Check the response
        expect(response.status).toBe(500);
    })

})