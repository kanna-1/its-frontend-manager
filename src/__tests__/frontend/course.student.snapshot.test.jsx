import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import CourseView from "@/app/courses/[courseId]/page";

// mock courseId param
const mockCourseIdParam = {
  courseId: "mock123",
};

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

// mock server action getCourseInfo
jest.mock("@/actions/getCourseInfo", () => {
  // mock course's questions
  const mockQuestions = [
    {
      id: "mockQuestionId1",
      title: "mockQuestion",
      description: "mockDescription",
      reference_program: "",
      courseId: "mockSchoolId_mock123",
    },
  ];

  // mock course's announcements
  const mockAnnouncements = [
    {
      id: "mockAnnouncementId1",
      title: "mockAnnouncementTitle1",
      body: "mockAnnouncementBody1",
      time: new Date("April 10, 2024 10:24:00"),
      course_id: "mockSchoolId_mock123",
    },
  ];

  return {
    getCourseInfo: jest.fn().mockResolvedValue({
      id: "mockSchoolId_mock123",
      code: "mock123",
      name: "mockCourse",
      creator_id: "mockCreatorId",
      school_id: "mockSchoolId",
      members: [],
      questions: mockQuestions,
      announcements: mockAnnouncements,
    }),
  };
});

it("renders student's course page unchanged", async () => {
  const result = await CourseView({ params: mockCourseIdParam });
  const { container } = render(result);
  expect(container).toMatchSnapshot();
});
