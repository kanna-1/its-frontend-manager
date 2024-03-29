/**
 * @jest-environment node
 */
import { getCourses } from '@/actions/getCourses'
import { prismaMock } from '@/prisma-mock';
import { Role } from "@prisma/client";

describe('/actions/getCourses', () => {
    test('should return user with the created and joined courses', async () => {
        const student = {
            id: "1",
            email: 'student@test.com',
            password: 'password1',
            school_id: 'inst001',
            role: Role.STUDENT,
            created_courses: [],
            joined_courses: []
        }
      prismaMock.user.findUnique.mockResolvedValue(student)

      const userEmail = {
        json: async () => ({
            userEmail: 'student@test.com'
        }), } as any

      // Call the function
      const courseUser = await getCourses(userEmail);
      expect(courseUser).toEqual(student);


    })
})