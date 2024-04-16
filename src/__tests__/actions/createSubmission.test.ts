/**
 * @jest-environment node
 */
import { createSubmission } from "@/actions/createSubmission";
import { prismaMock } from "@/prisma-mock";
import { Role } from "@prisma/client";

describe("/actions/createSubmission", () => {
  test("should create a new submission", async () => {
    const new_submission = {
      id: "submission_1",
      submit_time: new Date(),
      question_id: "",
      user_id: "student@test.com",
      submitted_program: "",
      feedback: "",
      grade: 100,
    };
    prismaMock.submission.create.mockResolvedValue(new_submission);

    const student = {
      id: "1",
      email: "student@test.com",
      password: "password123",
      role: Role.STUDENT,
      school_id: "inst001",
    };

    const course = {
      id: "inst001_CS3213",
      code: "CS3213",
      name: "Foundations of Software Engineering",
      creator_id: "teacher@test.com",
      school_id: "inst001",
    };

    const question = {
      id: "question_1",
      title: "question title",
      description: "question description",
      language: "python",
      entry_function: "",
      io_input: "",
      func_args: "",
      reference_program: "",
      courseId: "",
    };

    const question_param = {
      ...question,
      course: course,
      submissions: [],
    };

    prismaMock.question.update.mockResolvedValue(question);

    // Call the function
    const createdSubmission = await createSubmission({
      user: student,
      question: question_param,
      student_solution_url: "",
    });
    expect(createdSubmission).toEqual(new_submission);
  });

  test("should return error", async () => {
    prismaMock.submission.create.mockRejectedValue(new Error());

    const student = {
      id: "1",
      email: "student@test.com",
      password: "password123",
      role: Role.STUDENT,
      school_id: "inst001",
    };

    const course = {
      id: "inst001_CS3213",
      code: "CS3213",
      name: "Foundations of Software Engineering",
      creator_id: "teacher@test.com",
      school_id: "inst001",
    };

    const question = {
      id: "question_1",
      title: "question title",
      description: "question description",
      language: "python",
      entry_function: "",
      io_input: "",
      func_args: "",
      reference_program: "",
      courseId: "",
    };

    const question_param = {
      ...question,
      course: course,
      submissions: [],
    };

    // Call the function
    const created_submission = await createSubmission({
      user: student,
      question: question_param,
      student_solution_url: "",
    });
    expect(created_submission).toBeNull();
  });
});
