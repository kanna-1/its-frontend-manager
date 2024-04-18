import "@testing-library/jest-dom";
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

// mock redirect to return error so that redirects can be caught
jest.mock("next/navigation", () => ({
  redirect() {
    throw new Error("redirected");
  },
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

// mock server action getQuestionSubmissions to return nothing
jest.mock("@/actions/getQuestionSubmissions", () => {
  return {
    getQuestionSubmissions: jest.fn().mockResolvedValue(),
  };
});

it("no submissions for question - should be redirected away", async () => {
  try {
    const result = await GradingDashboardView({ params: mockQuestionParams });
  } catch (error) {
    expect(error.message).toBe("redirected");
  }
});
