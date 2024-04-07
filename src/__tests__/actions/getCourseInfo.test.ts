/**
 * @jest-environment node
 */
import { getCourseInfo } from '@/actions/getCourseInfo'
import { prismaMock } from '@/prisma-mock';

describe('/actions/getCourseInfo', () => {
    test('should return course info with questions and members', async () => {
        const test_course = {
            id: "inst001_CS3213",
            code: "CS3213",
            name: "Foundations of Software Engineering",
            creator_id: 'teacher@test.com',
            school_id: 'inst001',
            questions: [],
            members: [],
            announcements: []
        }
        prismaMock.course.findUnique.mockResolvedValue(test_course)

        const courseId = {
            json: async () => ({
                courseId: 'inst001_CS3213'
            }), } as any

        // Call the function
        const course = await getCourseInfo(courseId);
        expect(course).toEqual(test_course);

    })

    test('should not return course info as course is null', async () => {
        prismaMock.course.findUnique.mockResolvedValue(null)

        const courseId = {
            json: async () => ({
                courseId: ''
            }), } as any

        // Call the function
        const course = await getCourseInfo(courseId);
        expect(course).toEqual(null);

    })

    test('should return error', async () => {
        prismaMock.course.findUnique.mockRejectedValue(new Error())

        const courseId = {
            json: async () => ({
                courseId: 'inst001_CS3213'
            }), } as any

        // Call the function
        const course = await getCourseInfo(courseId);
        expect(course).toEqual(null);
    })
})

