/**
 * @jest-environment node
 */
import { getSubmission } from "@/actions/getSubmission";
import { prismaMock } from "@/prisma-mock";

describe("/actions/getSubmission", () => {
  test("should return the submission corresponding to the submission id", async () => {
    const expected_submission = {
      id: "submission_1",
      submit_time: new Date(),
      question_id: "",
      user_id: "student@test.com",
      submitted_program: "",
      feedback: "",
      grade: 100,
    };
    prismaMock.submission.findUnique.mockResolvedValue(expected_submission);

    const submission_id = {
      json: async () => ({
        submission_id: "submission_1",
      }),
    } as any;
    // Call the function
    const submission = await getSubmission(submission_id);
    expect(submission).toEqual(expected_submission);
  });

  test("should return null when submission is null", async () => {
    prismaMock.submission.findUnique.mockResolvedValue(null);

    const submission_id = {
      json: async () => ({
        submission_id: "",
      }),
    } as any;

    // Call the function
    const submission = await getSubmission(submission_id);
    expect(submission).toBeNull();
  });

  test("should return error", async () => {
    prismaMock.submission.findUnique.mockRejectedValue(new Error());

    const submission_id = {
      json: async () => ({
        submission_id: "submission_1",
      }),
    } as any;
    // Call the function
    const submission = await getSubmission(submission_id);
    expect(submission).toBeNull();
  });
});
