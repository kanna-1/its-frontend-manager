import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import GradingDashboardView from "@/app/courses/[courseId]/[questionId]/grading/page";

// mock courseId param
const mockQuestionParams = {
  questionId: "mockQuestionId",
  courseId: "mock123",
};

// mock usePathname
jest.mock("next/navigation", () => ({
  usePathname: () => ({
    replace: (text1, text2) => text2,
  }),
}));

// mock server action getUserProps
jest.mock("@/actions/getUserProps", () => {
  return {
    getUserProps: jest.fn().mockResolvedValue({
      id: "mockId1",
      email: "mockEmail1",
      password: "mockPw1",
      role: "TEACHER",
      school_id: "mockSchoolId",
    }),
  };
});

// mock server action getQuestionSubmissions
jest.mock("@/actions/getQuestionSubmissions", () => {
  const mockUserSubmissions = [
    {
      id: "mockSubmissionId2",
      submit_time: "2024-04-08",
      submitted_program: "mockProgram2",
      feedback: "mockFeedback2",
      grade: "10",
      question_id: "mockQuestionId",
      user_id: "mockId2",
      email: "mockEmail2",
      role: "STUDENT",
      school_id: "mockSchoolId",
    },
  ];

  return {
    getQuestionSubmissions: jest.fn().mockResolvedValue(mockUserSubmissions),
  };
});

it("renders teacher's grading page unchanged", async () => {
  const result = await GradingDashboardView({ params: mockQuestionParams });
  const { container } = render(result);
  expect(container).toMatchSnapshot();
});
