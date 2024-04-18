/**
 * @jest-environment node
 */
import { POST } from "@/app/api/course-management/remove-from-course/route";
import { prismaMock } from "@/prisma-mock";
import { Role } from "@prisma/client";

describe("/api/course-management/remove-from-course/route", () => {
  test("should return status 404 if course cannot be found", async () => {
    const request_obj = {
      json: async () => ({
        course_id: "inst001_CS3213",
        user_email_to_remove: "student@test.com",
      }),
    } as any;

    prismaMock.course.findUnique.mockResolvedValueOnce(null);

    // Call the POST function
    const response = await POST(request_obj);
    const body = await response.json();

    // Check the response
    expect(response.status).toBe(404);
    expect(body.error).toEqual("Invalid course ID.");
  });

  test("should return status 404 if the user to remove is not found", async () => {
    const request_obj = {
      json: async () => ({
        course_id: "inst001_CS3213",
        user_email_to_remove: "student@test.com",
      }),
    } as any;

    const course = {
      id: "inst001_CS3213",
      code: "CS3213",
      name: "Foundations of Software Engineering",
      creator_id: "teacher@test.com",
      school_id: "inst001",
    };
    prismaMock.course.findUnique.mockResolvedValueOnce(course);
    prismaMock.user.findUnique.mockResolvedValueOnce(null);

    // Call the POST function
    const response = await POST(request_obj);
    const body = await response.json();

    // Check the response
    expect(response.status).toBe(404);
    expect(body.error).toEqual(
      "User with email: student@test.com does not exist."
    );
  });

  test("should return status 200 if the user is removed from course successfully", async () => {
    const request_obj = {
      json: async () => ({
        course_id: "inst001_CS3213",
        user_email_to_remove: "student@test.com",
      }),
    } as any;

    const course = {
      id: "inst001_CS3213",
      code: "CS3213",
      name: "Foundations of Software Engineering",
      creator_id: "teacher@test.com",
      school_id: "inst001",
    };
    const student = {
      id: "1",
      email: "student@test.com",
      password: "password123",
      role: Role.STUDENT,
      school_id: "inst001",
    };

    prismaMock.course.findUnique.mockResolvedValueOnce(course);
    prismaMock.user.findUnique.mockResolvedValueOnce(student);
    prismaMock.user.update.mockResolvedValueOnce(student);

    // Call the POST function
    const response = await POST(request_obj);

    // Check the response
    expect(response.status).toBe(200);
  });

  test("should return status 500 if error is encountered", async () => {
    const request_obj = {
      json: async () => ({
        course_id: "inst001_CS3213",
        user_email_to_remove: "student@test.com",
      }),
    } as any;

    prismaMock.course.findUnique.mockRejectedValue(new Error());

    // Call the POST function
    const response = await POST(request_obj);

    // Check the response
    expect(response.status).toBe(500);
  });
});
