import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import MyCourseView from "@/app/courses/page";

// mock server action getUserProps
jest.mock("@/actions/getUserProps", () => ({
  getUserProps: jest.fn().mockResolvedValue({
    id: "mockId",
    email: "mockEmail",
    password: "mockPw",
    role: "STUDENT",
    school_id: "mockSchoolId",
    created_courses: [],
    joined_courses: [
      {
        id: "mockCourseId",
        code: "mockCourseCode",
        name: "mockCourseName",
        creator_id: "mockCreatorId",
        school_id: "mockSchoolId",
      },
    ],
  }),
}));

it("renders student's courses page unchanged", async () => {
  const result = await MyCourseView();
  const { container } = render(result);
  expect(container).toMatchSnapshot();
});
