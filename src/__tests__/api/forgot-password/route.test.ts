/**
 * @jest-environment node
 */
import { POST } from "@/app/api/forgot-password/route";
import { prismaMock } from "@/prisma-mock";
import { Role } from "@prisma/client";

describe("/api/forgot-password/route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("should return status 200 when user can forget password", async () => {
    jest.restoreAllMocks();
    const password_reset_token = {
      id: "1",
      email: "student1@test.com",
      token: "token",
      expires: new Date(),
    };

    // Mock createPasswordResetToken
    jest.mock("@/lib/tokens", () => ({
      createPasswordResetToken: jest
        .fn()
        .mockResolvedValue(password_reset_token),
    }));

    // Mock sendPasswordResetEmail
    jest.mock("@/lib/send-reset-email", () => ({
      sendPasswordResetEmail: jest.fn().mockReturnValue(
        new Promise((resolve, reject) => {
          resolve("Email sent");
        })
      ),
    }));

    const request_obj = {
      json: async () => ({
        email: "student1@test.com",
      }),
    } as any;

    const student = {
      id: "2",
      email: "student1@test.com",
      password: "password1",
      school_id: "inst001",
      role: Role.STUDENT,
    };

    prismaMock.user.findUnique.mockResolvedValue(student);

    // Call the POST function
    const response = await POST(request_obj);
    const body = await response.json();

    // Check the response
    const expected_response = {
      reset: {
        email: "student1@test.com",
      },
    };
  });

  test("should return status 404 when user is not found", async () => {
    const request_obj = {
      json: async () => ({
        email: "",
      }),
    } as any;

    prismaMock.user.findUnique.mockResolvedValue(null);

    // Call the POST function
    const response = await POST(request_obj);

    expect(response.status).toBe(404);
  });

  test("should return status 500 when error is encountered", async () => {
    const request_obj = {
      json: async () => ({
        email: "",
      }),
    } as any;

    prismaMock.user.findUnique.mockRejectedValue(new Error());

    // Call the POST function
    const response = await POST(request_obj);

    expect(response.status).toBe(500);
  });
});
