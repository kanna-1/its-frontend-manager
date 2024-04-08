/**
 * @jest-environment node
 */
import { setSubmissionGrade } from '@/actions/setSubmissionGrade'
import { prismaMock } from '@/prisma-mock';

describe('/actions/setSubmissionGrade', () => {
    test('should not update submission grade as the grade is not an integer', async () => {
        const submission1 = {
            id: "submission_1",
            submit_time: new Date(),
            question_id: "question_1",
            user_id: "student@test.com",
            submitted_program: "",
            feedback: "",
            grade: "A"
        }

        prismaMock.submission.update.mockResolvedValue(submission1)

        // Call the function
        const submission = await setSubmissionGrade({submission_id: "submission_1", grade: "A"});
        expect(submission).toEqual(null);
    })

    test('should not update submission grade as the grade is not between 0 and 100', async () => {
        const submission1 = {
            id: "submission_1",
            submit_time: new Date(),
            question_id: "question_1",
            user_id: "student@test.com",
            submitted_program: "",
            feedback: "",
            grade: -1
        }

        prismaMock.submission.update.mockResolvedValue(submission1)

        // Call the function
        const submission = await setSubmissionGrade({submission_id: "submission_1", grade: -1});
        expect(submission).toEqual(null);
    })

    test('should not update submission grade as the submission is null', async () => {
        prismaMock.submission.update.mockResolvedValue(null)

        // Call the function
        const submission = await setSubmissionGrade({submission_id: "", grade: 100});
        expect(submission).toEqual(null);
    })

    test('should update submission grade', async () => {
        const submission1 = {
            id: "submission_1",
            submit_time: new Date(),
            question_id: "question_1",
            user_id: "student@test.com",
            submitted_program: "",
            feedback: "",
            grade: 100
        }

        prismaMock.submission.update.mockResolvedValue(submission1)

        // Call the function
        const submission = await setSubmissionGrade({submission_id: "submission_1", grade: 100});
        expect(submission).toEqual(submission1);
    })

    test('should return error', async () => {
        prismaMock.submission.update.mockRejectedValue(new Error())

        // Call the function
        const submission = await setSubmissionGrade({submission_id: "submission_1", grade: 100});
        expect(submission).toEqual(null);
    })
})