/**
 * @jest-environment node
 */
import { DELETE } from "@/app/api/user-management/delete-row/route";
import { prismaMock } from "@/prisma-mock";
import { Role } from "@prisma/client";

describe("/api/user-management/delete-row/route", () => {
  test("should return status 200 when delete row is successful", async () => {
    const student = {
      id: "1",
      email: "student@test.com",
      password: "password1",
      school_id: "inst001",
      role: Role.STUDENT,
    };

    prismaMock.user.findUnique.mockResolvedValue(student);
    prismaMock.user.delete.mockResolvedValue(student);
    const request_obj = {
      json: async () => ({
        email: "student@test.com",
      }),
    } as any;

    const expected_response = {
      deleted: {
        email: "student@test.com",
      },
    };

    // Call the POST function
    const response = await DELETE(request_obj);
    const body = await response.json();

    // Check the response
    expect(response.status).toBe(200);
    expect(body).toEqual(expected_response);
  });

  test("should return status 404 when requestor cannot be found", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    const request_obj = {
      json: async () => ({
        email: "",
      }),
    } as any;

    // Call the POST function
    const response = await DELETE(request_obj);
    const body = await response.json();

    // Check the response
    expect(response.status).toBe(404);
    expect(body.error).toEqual("Not a valid user.");
  });

  test("should return status 500 when error is encountered", async () => {
    prismaMock.user.findUnique.mockRejectedValue(new Error());
    const request_obj = {
      json: async () => ({
        email: "student@test.com",
      }),
    } as any;

    // Call the POST function
    const response = await DELETE(request_obj);
    const body = await response.json();

    // Check the response
    expect(response.status).toBe(500);
  });
});
