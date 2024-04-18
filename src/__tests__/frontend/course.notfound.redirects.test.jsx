import "@testing-library/jest-dom";
import CourseView from "@/app/courses/[courseId]/page";

// mock courseId param
const mockCourseIdParam = {
  courseId: "mock123",
};

// mock redirect to return error so that redirects can be caught
jest.mock("next/navigation", () => ({
  redirect() {
    throw new Error("redirected");
  },
}));

// mock server action getUserProps
jest.mock("@/actions/getUserProps", () => ({
  getUserProps: jest.fn().mockResolvedValue({
    id: "mockId1",
    email: "mockEmail1",
    password: "mockPw1",
    role: "STUDENT",
    school_id: "mockSchoolId",
  }),
}));

// mock server action getCourseInfo to return nothing
jest.mock("@/actions/getCourseInfo", () => {
  return {
    getCourseInfo: jest.fn().mockResolvedValue(),
  };
});

it("course not found - should be redirected away", async () => {
  try {
    const result = await CourseView({ params: mockCourseIdParam });
  } catch (error) {
    expect(error.message).toBe("redirected");
  }
});
