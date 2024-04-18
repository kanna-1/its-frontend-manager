/**
 * @jest-environment node
 */
import { POST } from "@/app/api/user-management/promote-to-teacher/route";
import { prismaMock } from "@/prisma-mock";
import { Role } from "@prisma/client";

describe("/api/user-management/promote-to-teacher/route", () => {
  test("should return status 200 when a user is promoted to a teacher role", async () => {
    const student = {
      id: "1",
      email: "student@test.com",
      password: "password1",
      school_id: "inst001",
      role: Role.STUDENT,
    };
    prismaMock.user.findUnique.mockResolvedValue(student);
    prismaMock.user.update.mockResolvedValue(student);
    const request_obj = {
      json: async () => ({
        email: "student@test.com",
      }),
    } as any;

    // Call the POST function
    const response = await POST(request_obj);

    // Check the response
    expect(response.status).toBe(200);
  });

  test("should return status 404 when the requestor cannot be found", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    const request_obj = {
      json: async () => ({
        email: "student@test.com",
      }),
    } as any;

    // Call the POST function
    const response = await POST(request_obj);

    // Check the response
    expect(response.status).toBe(404);
  });

  test("should return status 500 when error is encountered", async () => {
    prismaMock.user.findUnique.mockRejectedValue(new Error());
    const request_obj = {
      json: async () => ({
        email: "student@test.com",
      }),
    } as any;

    // Call the POST function
    const response = await POST(request_obj);

    // Check the response
    expect(response.status).toBe(500);
  });
});
