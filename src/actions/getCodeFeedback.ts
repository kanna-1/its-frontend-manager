"use server";

import { FeedbackType } from "@/components/question-view/QuestionViewFeedback";
/*
Request for this API should be of the following form. This is consistent with the request format of the Feedback Service ITS API
- language: python | c | py
- reference_solution: string (program)
- student_solution: string (program)
- function: string (the entry function of the program)
- inputs: IO inputs
- args: arguments of the entry function (for e.g. "[2]") (string wrapped in '[]')

Example Usage:

const ref_program = `def main():
    a = 10
    b = 0
    for i in range(0, a):
        b = b + 1
    return b`

const student_program = `def main():
    a = 10
    b = 0
    for i in range(0, a):
        b = b - 1
    return b`

**Note that the function declaration must not start with a newline and the indentation of the code is consistent with python indentation.**

const requestData = {
    language: 'python',
    reference_solution: ref_program,
    student_solution: student_program,
    function: "main",
    inputs: "[]",
    args: "",
};

const feedback = await fetch(process.env.URL + '/api/get-feedback', {
    method: 'POST',
    body: JSON.stringify(requestData),
});

*/

import { Question } from "@prisma/client";

const parserApiUrl = "https://its.comp.nus.edu.sg/cs3213/parser";
const feedbackFixApiUrl = "https://its.comp.nus.edu.sg/cs3213/feedback_fix";

const language_map = {
  py: "python",
  c: "c",
};

export async function getCodeFeedback({
  question,
  student_solution,
}: {
  question: Question;
  student_solution: string;
}): Promise<
  | {
      status: string;
      feedback: FeedbackType[];
    }
  | {
      status: string;
      feedback: FeedbackType[];
    }
> {
  try {
    const { reference_program, language } = question;
    const reference_program_text = await fetch(reference_program).then((res) =>
      res.text()
    );

    // Parse student and reference program
    const parsedStudentCode = await parseCode(
      language_map[language],
      student_solution
    );

    const parsedReferenceCode = await parseCode(
      language_map[language],
      reference_program_text
    );

    // Generate feedback from ITS
    const feedback = await generateFeedback({
      language: question.language,
      reference_solution: JSON.stringify(parsedReferenceCode),
      student_solution: JSON.stringify(parsedStudentCode),
      function: question.entry_function || "main",
      inputs: question.io_input || "[]",
      args: question.func_args || "",
    });

    return {
      status: "",
      feedback: feedback,
    };
  } catch (error) {
    console.error(error);
    return {
      status: error.message,
      feedback: [],
    };
  }
}

// Call ITS Parser API
async function parseCode(language: string, code: string): Promise<object> {
  const response = await fetch(parserApiUrl, {
    method: "POST",
    body: JSON.stringify({
      language: language,
      source_code: code,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 422) {
    throw new Error("Parser: Validation error");
  } else if (!response.ok) {
    throw new Error("Parser: Unknown error");
  }
  return await response.json();
}

// Call ITS Feedback API
async function generateFeedback(req: {
  language: string;
  reference_solution: string;
  student_solution: string;
  function: string;
  inputs: string;
  args: string;
}): Promise<FeedbackType[]> {
  const response = await fetch(feedbackFixApiUrl, {
    method: "POST",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 422) {
    throw new Error("Feedback Fix: Validation error");
  } else if (!response.ok) {
    throw new Error("Feedback Fix: Unknown error");
  }

  return await response.json();
}
