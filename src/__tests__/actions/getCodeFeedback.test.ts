/**
 * @jest-environment node
 */
import { getCodeFeedback } from "@/actions/getCodeFeedback";

describe("/actions/getCodeFeedback", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should throw parser validation error", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve("text"),
        status: 422,
      })
    );

    // Call the function
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
    };
    const feedback = await getCodeFeedback({
      question: question,
      student_solution: "",
    });
    expect(feedback.status).toEqual("Parser: Validation error");
    expect(feedback.feedback).toEqual([]);
  });

  test("should throw unknown error", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve("text"),
        status: 500,
      })
    );

    // Call the function
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
    };
    const feedback = await getCodeFeedback({
      question: question,
      student_solution: "",
    });
    expect(feedback.status).toEqual("Parser: Unknown error");
    expect(feedback.feedback).toEqual([]);
  });

  test("should return feedback successfully", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve("text"),
        json: () => Promise.resolve({}),
        status: 200,
        ok: true,
      })
    );

    // Call the function
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
    };
    const feedback = await getCodeFeedback({
      question: question,
      student_solution: "",
    });
    expect(feedback.status).toEqual("");
    expect(feedback.feedback).toEqual({});
  });
});
