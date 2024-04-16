/**
 * @jest-environment node
 */
import { getUsers } from "@/actions/getUsers";
import { prismaMock } from "@/prisma-mock";
import { Role } from "@prisma/client";

describe("/actions/getUsers", () => {
  test("should return the list of all users if requestor is admin", async () => {
    const expected_users = [
      {
        id: "1",
        email: "student1@test.com",
        password: "password123",
        role: Role.STUDENT,
        school_id: "inst001",
      },
      {
        id: "2",
        email: "student2@test.com",
        password: "password123",
        role: Role.STUDENT,
        school_id: "inst001",
      },
    ];

    const admin = {
      id: "3",
      email: "admin@test.com",
      password: "admin123",
      role: Role.ADMIN,
      school_id: "inst001",
    };

    prismaMock.user.findMany.mockResolvedValue(expected_users);

    // Call the function
    const users = await getUsers(admin);
    expect(users).toEqual(expected_users);
  });

  test("should return null when getting users if requestor is not admin", async () => {
    const student = {
      id: "1",
      email: "student@test.com",
      password: "password123",
      role: Role.STUDENT,
      school_id: "inst001",
    };

    // Call the function
    const users = await getUsers(student);
    expect(users).toBeNull();
  });
});
