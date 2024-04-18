import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import MyCourseView from "@/app/courses/page";

// mock useRouter
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

// mock server action getUserProps
jest.mock("@/actions/getUserProps", () => ({
  getUserProps: jest.fn().mockResolvedValue({
    id: "mockId",
    email: "mockEmail",
    password: "mockPw",
    role: "TEACHER",
    school_id: "mockSchoolId",
    created_courses: [
      {
        id: "mockCourseId1",
        code: "mockCourseCode1",
        name: "mockCourseName1",
        creator_id: "mockId",
        school_id: "mockSchoolId",
      },
    ],
    joined_courses: [
      {
        id: "mockCourseId2",
        code: "mockCourseCode2",
        name: "mockCourseName2",
        creator_id: "mockCreatorId",
        school_id: "mockSchoolId",
      },
    ],
  }),
}));

it("renders teacher's courses page unchanged", async () => {
  const result = await MyCourseView();
  const { container } = render(result);
  expect(container).toMatchSnapshot();
});
