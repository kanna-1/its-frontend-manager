
/**
 * @jest-environment node
 */
import { POST } from '@/app/api/upload/question/route'
import { prismaMock } from '@/prisma-mock';

describe('/api/upload/question/route', () => {
    test('should return status 500 as there is no course id', async () => {
        const requestObj = {
            json: async () => ({
                reference_program: "reference_program_1",
                courseId: null,
                content: {}

            }), } as any

        // Call the POST function
        const response = await POST(requestObj);
        const body = await response.json();

        // Check the response
        expect(response.status).toBe(500);
        expect(body.body).toEqual('Expected course id.');
    })

    test('should return status 500 as there is no reference program', async () => {
        const requestObj = {
            json: async () => ({
                reference_program: null,
                courseId: "inst001_CS3213",
                content: {}

            }), } as any

        // Call the POST function
        const response = await POST(requestObj);
        const body = await response.json();

        // Check the response
        expect(response.status).toBe(500);
        expect(body.body).toEqual('Expected reference program id. Please upload the reference program first.');
    })

    test('should return status 500 if unable to find course', async () => {
        const requestObj = {
            json: async () => ({
                reference_program: "reference_program_1",
                courseId: "inst001_CS3213",
                content: {}

            }), } as any

        // Call the POST function
        const response = await POST(requestObj);
        const body = await response.json();

        const question = {
            id: "question_1",
            title: "question title",
            description: "question description",
            language: "python",
            entry_function: "",
            io_input: "",
            func_args: "",
            reference_program: "",
            courseId: "inst001_CS3213"
        }

        prismaMock.question.create.mockResolvedValue(question)
        prismaMock.course.findUnique.mockResolvedValue(null)

        // Check the response
        expect(response.status).toBe(500);
        expect(body.body).toEqual("Unable to find course");
    })

    // test('should return status 200 if upload question is successful', async () => {
    //     const requestObj = {
    //         json: async () => ({
    //             reference_program: "reference_program_1",
    //             courseId: "inst001_CS3213",
    //             content: {}

    //         }), } as any

    //     // Call the POST function
    //     const response = await POST(requestObj);
    //     const body = await response.json();

    //     const course = {
    //         id: "inst001_CS3213",
    //         code: "CS3213",
    //         name: "Foundations of Software Engineering",
    //         creator_id: 'teacher@test.com',
    //         school_id: 'inst001',
    //         questions: [],
    //         announcements: []
    //     }

    //     const question = {
    //         id: "question_1",
    //         title: "question title",
    //         description: "question description",
    //         language: "python",
    //         entry_function: "",
    //         io_input: "",
    //         func_args: "",
    //         reference_program: "reference_program_1",
    //         course: course
    //     }


    //     prismaMock.question.create.mockResolvedValue(question)
    //     prismaMock.course.findUnique.mockResolvedValue(course)

    //     prismaMock.course.update.mockResolvedValue(course)

    //     // Check the response
    //     expect(response.status).toBe(200);
    // })

})