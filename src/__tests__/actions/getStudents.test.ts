/**
 * @jest-environment node
 */
import { getStudents } from '@/actions/getStudents'
import { prismaMock } from '@/prisma-mock';
import { Role } from "@prisma/client";

describe('/actions/getStudents', () => {
    test('should return the list of students if requestor is a teacher', async () => {
        const expected_students = [
            {
                id: "1",
                email: "student1@test.com",
                password: "password123",
                role: Role.STUDENT,
                school_id: "inst001",
              },
              {
                id: "2",
                email: "student2@test.com",
                password: "password123",
                role: Role.STUDENT,
                school_id: "inst001",
              }
        ]

        const teacher = {
            id: "3",
            email: "teacher@test.com",
            password: "teacher123",
            role: Role.TEACHER,
            school_id: "inst001",
        }
        prismaMock.user.findMany.mockResolvedValue(expected_students)

        // Call the function
        const students = await getStudents(teacher);
        expect(students).toEqual(expected_students);

    })
})