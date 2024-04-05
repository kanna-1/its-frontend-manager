/**
 * @jest-environment node
 */
import { getQuestionSubmissions } from '@/actions/getQuestionSubmissions'
import { prismaMock } from '@/prisma-mock';
import { Role } from "@prisma/client";

describe('/actions/getQuestionSubmissions', () => {
    test('should get question submissions', async () => {
        const student = {
            email: "student@test.com",
            role: Role.STUDENT,
            school_id: "inst001",
        }

        const submission1 = {
            id: "submission_1",
            submit_time: new Date(),
            question_id: "question_1",
            user_id: "student@test.com",
            submitted_program: "",
            feedback: "",
            grade: 100,
            user: student
        }

        const question = {
            id: "question_1",
            title: "question title",
            description: "question description",
            language: "python",
            entry_function: "",
            io_input: "",
            func_args: "",
            reference_program: "",
            courseId: "inst001_CS3213",
            submissions: [submission1]
        }

        prismaMock.question.findUnique.mockResolvedValue(question)

        const expected_output = [{...submission1, ...student}]

        // Call the function
        const questionSubmission = await getQuestionSubmissions({questionId: "question_1"});
        expect(questionSubmission).toEqual(expected_output);
    })

    test('should not get the submissions as question is null', async () => {
        prismaMock.question.findUnique.mockResolvedValue(null)

        // Call the function
        const questionSubmission = await getQuestionSubmissions({questionId: ""});
        expect(questionSubmission).toEqual(null);

    })

})