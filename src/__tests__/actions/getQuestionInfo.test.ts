/**
 * @jest-environment node
 */
import { getQuestionInfo } from "@/actions/getQuestionInfo";
import { prismaMock } from "@/prisma-mock";

describe("/actions/getQuestionInfo", () => {
  test("should get question information", async () => {
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
      courseId: "inst001_CS3213",
      course: course,
      submissions: [],
    };

    prismaMock.question.findUnique.mockResolvedValue(question);

    // Call the function
    const question_info = await getQuestionInfo({
      question_id: "question_1",
      course_id: "CS3213",
      school_id: "inst001",
    });
    expect(question_info).toEqual(question);
  });

  test("should not get question information if cannot find the question corresponding to the question id", async () => {
    prismaMock.question.findUnique.mockResolvedValue(null);

    // Call the function
    const question_info = await getQuestionInfo({
      question_id: "question_1",
      course_id: "CS3213",
      school_id: "inst001",
    });
    expect(question_info).toBeNull();
  });
});
