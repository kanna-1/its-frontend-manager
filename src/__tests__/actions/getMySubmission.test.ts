/**
 * @jest-environment node
 */
import { getMySubmissions } from "@/actions/getMySubmissions";
import { prismaMock } from "@/prisma-mock";
import { Role } from "@prisma/client";

describe("/actions/getMySubmissions", () => {
  test("should get the submissions based on user and question", async () => {
    const submission_1 = {
      id: "submission_1",
      submit_time: new Date(),
      question_id: "question_1",
      user_id: "student@test.com",
      submitted_program: "",
      feedback: "",
      grade: 100,
    };

    const submission_2 = {
      id: "submission_2",
      submit_time: new Date(),
      question_id: "question_2",
      user_id: "student@test.com",
      submitted_program: "",
      feedback: "",
      grade: 100,
    };

    const student = {
      id: "1",
      email: "student@test.com",
      password: "password123",
      role: Role.STUDENT,
      school_id: "inst001",
      submissions: [submission_1, submission_2],
    };

    prismaMock.user.findUnique.mockResolvedValue(student);

    // Call the function
    const submission = await getMySubmissions({
      question_id: "question_2",
      user_email: "student@test.com",
    });
    expect(submission).toEqual([submission_2]);
  });

  test("should not get the submissions as user is null", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    // Call the function
    const submission = await getMySubmissions({
      question_id: "question_2",
      user_email: "",
    });
    expect(submission).toBeNull();
  });

  test("should return error", async () => {
    prismaMock.user.findUnique.mockRejectedValue(new Error());

    // Call the function
    const submission = await getMySubmissions({
      question_id: "question_2",
      user_email: "",
    });
    expect(submission).toBeNull();
  });
});
