/**
 * @jest-environment node
 */
import { POST } from "@/app/api/user-management/bulk-promote-to-teacher/route";
import { prismaMock } from "@/prisma-mock";

describe("/api/user-management/bulk-promote-to-teacher/route", () => {
  test("should return status 200 when bulk promote users to teachers is successful", async () => {
    prismaMock.user.updateMany.mockResolvedValue({ count: 2 });
    const request_obj = {
      json: async () => ({
        emails: ["student@test.com", "student2@test.com"],
      }),
    } as any;

    // Call the POST function
    const response = await POST(request_obj);

    // Check the response
    expect(response.status).toBe(200);
    expect(prismaMock.user.updateMany).toHaveBeenCalledWith({
      where: {
        email: {
          in: ["student@test.com", "student2@test.com"],
        },
      },
      data: {
        role: "TEACHER",
      },
    });
  });

  test("should return status 500 when error is encountered", async () => {
    prismaMock.user.updateMany.mockRejectedValue(new Error());
    const request_obj = {
      json: async () => ({
        emails: ["student@test.com", "student2@test.com"],
      }),
    } as any;

    // Call the POST function
    const response = await POST(request_obj);

    // Check the response
    expect(response.status).toBe(500);
  });
});
