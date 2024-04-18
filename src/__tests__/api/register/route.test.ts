/**
 * @jest-environment node
 */
import { POST } from "../../../app/api/register/route";
import { prismaMock } from "@/prisma-mock";
import { Role } from "@prisma/client";

describe("/api/register", () => {
  test("should return new user registered with status 200", async () => {
    const test_user = {
      id: "1",
      email: "tester1@test.com",
      password: "password1",
      school_id: "inst001",
      role: Role.STUDENT,
    };

    const request_obj = {
      json: async () => ({
        email: "tester1@test.com",
        password: "password1",
        school_id: "inst001",
        role: Role.STUDENT,
      }),
    } as any;

    const expected_response = {
      user: {
        email: "tester1@test.com",
        school_id: "inst001",
        role: Role.STUDENT,
      },
    };
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(test_user);

    // Call the POST function
    const response = await POST(request_obj);
    const body = await response.json();

    // Check the response
    expect(response.status).toBe(200);
    expect(body).toEqual(expected_response);
  });

  test("should return status 409 when the email address is already registered", async () => {
    const test_user = {
      id: "1",
      email: "tester1@test.com",
      password: "password1",
      school_id: "inst001",
      role: Role.STUDENT,
    };

    const request_obj = {
      json: async () => ({
        email: "tester1@test.com",
        password: "password1",
        school_id: "inst001",
        role: Role.STUDENT,
      }),
    } as any;

    prismaMock.user.findUnique.mockResolvedValue(test_user);

    // Call the POST function
    const response = await POST(request_obj);

    // Check the response
    expect(response.status).toBe(409);
  });

  test("should return status 500 when error is encountered", async () => {
    const request_obj = {
      json: async () => ({
        email: "tester1@test.com",
        password: "password1",
        school_id: "inst001",
        role: Role.STUDENT,
      }),
    } as any;

    prismaMock.user.findUnique.mockRejectedValue(new Error());

    // Call the POST function
    const response = await POST(request_obj);
    const body = await response.json();

    // Check the response
    expect(response.status).toBe(500);
  });
});
