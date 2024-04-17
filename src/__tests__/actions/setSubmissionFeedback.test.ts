/**
 * @jest-environment node
 */
import { setSubmissionFeedback } from "@/actions/setSubmissionFeedback";
import { prismaMock } from "@/prisma-mock";

describe("/actions/setSubmissionFeedback", () => {
  test("should update submission feedback", async () => {
    const submission_1 = {
      id: "submission_1",
      submit_time: new Date(),
      question_id: "question_1",
      user_id: "student@test.com",
      submitted_program: "",
      feedback: "",
      grade: 100,
    };

    prismaMock.submission.update.mockResolvedValue(submission_1);

    // Call the function
    const submission = await setSubmissionFeedback({
      submission_id: "submission_1",
      feedback: "",
    });
    expect(submission).toEqual(submission_1);
  });

  test("cannot update submission feedback as submission is null", async () => {
    prismaMock.submission.update.mockResolvedValue(null);

    // Call the function
    const submission = await setSubmissionFeedback({
      submission_id: "",
      feedback: "",
    });
    expect(submission).toBeNull();
  });

  test("should return error", async () => {
    prismaMock.submission.update.mockRejectedValue(new Error());

    // Call the function
    const submission = await setSubmissionFeedback({
      submission_id: "submission_1",
      feedback: "",
    });
    expect(submission).toBeNull();
  });
});
