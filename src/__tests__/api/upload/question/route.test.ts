/**
 * @jest-environment node
 */
import { POST } from "@/app/api/upload/question/route";
import { prismaMock } from "@/prisma-mock";

describe("/api/upload/question/route", () => {
  test("should return status 400 as there is no course id", async () => {
    const request_obj = {
      json: async () => ({
        reference_program: "reference_program_1",
        courseId: null,
        content: {},
      }),
    } as any;

    // Call the POST function
    const response = await POST(request_obj);
    const body = await response.json();

    // Check the response
    expect(response.status).toBe(400);
    expect(body.error).toEqual("Expected course id.");
  });

  test("should return status 400 as there is no reference program", async () => {
    const request_obj = {
      json: async () => ({
        reference_program: null,
        courseId: "inst001_CS3213",
        content: {},
      }),
    } as any;

    // Call the POST function
    const response = await POST(request_obj);
    const body = await response.json();

    // Check the response
    expect(response.status).toBe(400);
    expect(body.error).toEqual(
      "Expected reference program id. Please upload the reference program first."
    );
  });

  test("should return status 404 if unable to find course", async () => {
    const request_obj = {
      json: async () => ({
        reference_program: "reference_program_1",
        courseId: "inst001_CS3213",
        content: {},
      }),
    } as any;

    // Call the POST function
    const response = await POST(request_obj);
    const body = await response.json();

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

    prismaMock.question.create.mockResolvedValue(question);
    prismaMock.course.findUnique.mockResolvedValue(null);

    // Check the response
    expect(response.status).toBe(404);
    expect(body.error).toEqual("Unable to find course");
  });
});
