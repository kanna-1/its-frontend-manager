/**
 * @jest-environment node
 */
import { POST } from "@/app/api/course-management/add-to-course/route";
import { prismaMock } from "@/prisma-mock";
import { Role } from "@prisma/client";

describe("/api/course-management/add-to-course/route", () => {
  test("should return status 403 as student has no permission to add users to course", async () => {
    const student = {
      id: "1",
      email: "student@test.com",
      password: "password1",
      school_id: "inst001",
      role: Role.STUDENT,
    };
    prismaMock.user.findUnique.mockResolvedValue(student);

    const request_obj = {
      json: async () => ({
        requestor_email: "student@test.com",
        course_id: "inst001_CS3213",
        emails_to_add: ["test2@test.com", "test3@test.com"],
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

  test("should return status 404 as requestor is null", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const request_obj = {
      json: async () => ({
        requestor_email: "null@test.com",
        course_id: "inst001_CS3213",
        emails_to_add: ["test2@test.com", "test3@test.com"],
      }),
    } as any;

    // Call the POST function
    const response = await POST(request_obj);
    const body = await response.json();

    // Check the response
    expect(response.status).toBe(404);
    expect(body.error).toEqual("Not a valid user.");
  });

  test("should return status 404 as the course is undefined", async () => {
    const teacher = {
      id: "2",
      email: "teacher@test.com",
      password: "password1",
      school_id: "inst001",
      role: Role.TEACHER,
    };
    prismaMock.user.findUnique.mockResolvedValue(teacher);
    prismaMock.course.findUnique.mockResolvedValue(null);

    const request_obj = {
      json: async () => ({
        requestor_email: "teacher@test.com",
        course_id: "inst001_CS3213",
        emails_to_add: ["test2@test.com", "test3@test.com"],
      }),
    } as any;

    // Call the POST function
    const response = await POST(request_obj);
    const body = await response.json();

    // Check the response
    expect(response.status).toBe(404);
    expect(body.error).toEqual("Invalid course ID.");
  });

  test("should return status 200 as a teacher is adding users to a created course", async () => {
    const teacher = {
      id: "2",
      email: "teacher@test.com",
      password: "password1",
      school_id: "inst001",
      role: Role.TEACHER,
    };

    const course = {
      id: "inst001_CS3213",
      code: "CS3213",
      name: "Foundations of Software Engineering",
      creator_id: "teacher@test.com",
      school_id: "inst001",
    };

    const mock_user = {
      id: "3",
      email: "student@test.com",
      password: "password1",
      school_id: "inst001",
      role: Role.STUDENT,
    };

    prismaMock.user.findUnique.mockResolvedValue(teacher);
    prismaMock.course.findUnique.mockResolvedValue(course);
    prismaMock.user.update.mockResolvedValue(mock_user);

    const request_obj = {
      json: async () => ({
        requestor_email: "teacher@test.com",
        course_id: "inst001_CS3213",
        emails_to_add: ["test2@test.com", "test3@test.com"],
      }),
    } as any;

    // Call the POST function
    const response = await POST(request_obj);

    // Check the response
    expect(response.status).toBe(200);
  });

  test("should return status 404 as user to be added is not found ", async () => {
    const teacher = {
      id: "2",
      email: "teacher@test.com",
      password: "password1",
      school_id: "inst001",
      role: Role.TEACHER,
    };

    const course = {
      id: "inst001_CS3213",
      code: "CS3213",
      name: "Foundations of Software Engineering",
      creator_id: "teacher@test.com",
      school_id: "inst001",
    };

    prismaMock.user.findUnique.mockResolvedValueOnce(teacher);
    prismaMock.course.findUnique.mockResolvedValue(course);
    prismaMock.user.findUnique.mockResolvedValueOnce(null);

    const request_obj = {
      json: async () => ({
        requestor_email: "teacher@test.com",
        course_id: "inst001_CS3213",
        emails_to_add: ["test2@test.com", "test3@test.com"],
      }),
    } as any;

    // Call the POST function
    const response = await POST(request_obj);

    // Check the response
    expect(response.status).toBe(404);
  });

  test("should return status 500 when error is encountered ", async () => {
    prismaMock.user.findUnique.mockRejectedValue(new Error("Error"));

    const request_obj = {
      json: async () => ({
        requestor_email: "teacher@test.com",
        course_id: "inst001_CS3213",
        emails_to_add: ["test2@test.com", "test3@test.com"],
      }),
    } as any;

    // Call the POST function
    const response = await POST(request_obj);

    // Check the response
    expect(response.status).toBe(500);
  });
});
