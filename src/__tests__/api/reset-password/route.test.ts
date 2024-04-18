/**
 * @jest-environment node
 */
import { POST } from "@/app/api/reset-password/route";
import { prismaMock } from "@/prisma-mock";
import { Role } from "@prisma/client";

describe("/api/reset-password/route", () => {
  test("should return status 200 when user can reset password", async () => {
    const request_obj = {
      json: async () => ({
        password: "password123",
        token: "token123",
      }),
    } as any;

    const token = {
      id: "1",
      email: "student1@test.com",
      token: "token123",
      expires: new Date(),
    };

    const mock_user = {
      id: "2",
      email: "student1@test.com",
      password: "password1",
      school_id: "inst001",
      role: Role.STUDENT,
    };
    prismaMock.passwordResetToken.findUnique.mockResolvedValue(token);
    prismaMock.user.update.mockResolvedValue(mock_user);

    // Call the POST function
    const response = await POST(request_obj);
    const body = await response.json();

    // Check the response
    const expected_response = {
      user: {
        email: "student1@test.com",
      },
    };
    expect(response.status).toBe(200);
    expect(body).toEqual(expected_response);
  });

  test("should return status 404 when reset password is null", async () => {
    const request_obj = {
      json: async () => ({
        password: "password123",
        token: "token123",
      }),
    } as any;

    prismaMock.passwordResetToken.findUnique.mockResolvedValue(null);

    // Call the POST function
    const response = await POST(request_obj);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toEqual("Invalid password reset token.");
  });

  test("should return status 500 when error is encountered", async () => {
    const request_obj = {
      json: async () => ({
        password: "password123",
        token: "token123",
      }),
    } as any;

    prismaMock.passwordResetToken.findUnique.mockRejectedValue(new Error());

    // Call the POST function
    const response = await POST(request_obj);

    expect(response.status).toBe(500);
  });
});
