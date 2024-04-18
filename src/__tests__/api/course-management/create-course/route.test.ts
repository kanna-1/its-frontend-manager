/**
 * @jest-environment node
 */
import { POST } from "@/app/api/course-management/create-course/route";
import { prismaMock } from "@/prisma-mock";
import { Role } from "@prisma/client";

describe("/api/course-management/create-course/route", () => {
  test("should return status 403 as student has no permission to create course", async () => {
    const request_obj = {
      json: async () => ({
        user_id: "student@test.com",
        user_role: Role.STUDENT,
        school_id: "inst001",
        code: "CS3213",
        name: "Software Engineering",
      }),
    } as any;

    // Call the POST function
    const response = await POST(request_obj);
    const body = await response.json();

    // Check the response
    expect(response.status).toBe(403);
    expect(body.error).toEqual(
      "You do not have the permission to make this request."
    );
  });

  test("should return status 409 as the teacher tries to create a duplicate course", async () => {
    const course = {
      id: "inst001_CS3213",
      code: "CS3213",
      name: "Foundations of Software Engineering",
      creator_id: "teacher@test.com",
      school_id: "inst001",
    };

    prismaMock.course.findUnique.mockResolvedValue(course);

    const request_obj = {
      json: async () => ({
        user_id: "teacher@test.com",
        user_role: Role.TEACHER,
        school_id: "inst001",
        code: "CS3213",
        name: "Software Engineering",
      }),
    } as any;

    // Call the POST function
    const response = await POST(request_obj);
    const body = await response.json();

    // Check the response
    expect(response.status).toBe(409);
    expect(body.error).toEqual("Course already exists.");
  });

  test("should return status 200 as the teacher creates a course which was not created before", async () => {
    const course = {
      id: "inst001_CS3213",
      code: "CS3213",
      name: "Foundations of Software Engineering",
      creator_id: "teacher@test.com",
      school_id: "inst001",
    };

    prismaMock.course.findUnique.mockResolvedValue(null);
    prismaMock.course.create.mockResolvedValue(course);

    const request_obj = {
      json: async () => ({
        user_id: "teacher@test.com",
        user_role: Role.TEACHER,
        school_id: "inst001",
        code: "CS3213",
        name: "Software Engineering",
      }),
    } as any;

    // Call the POST function
    const response = await POST(request_obj);

    // Check the response
    expect(response.status).toBe(200);
  });

  test("should return status 500 when error is encountered", async () => {
    prismaMock.course.findUnique.mockRejectedValue(new Error());

    const request_obj = {
      json: async () => ({
        user_id: "teacher@test.com",
        user_role: Role.TEACHER,
        school_id: "inst001",
        code: "CS3213",
        name: "Software Engineering",
      }),
    } as any;

    // Call the POST function
    const response = await POST(request_obj);

    // Check the response
    expect(response.status).toBe(500);
  });
});
