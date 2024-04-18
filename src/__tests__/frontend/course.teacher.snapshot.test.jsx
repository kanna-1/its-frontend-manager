import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import CourseView from "@/app/courses/[courseId]/page";

// mock courseId param
const mockCourseIdParam = {
  courseId: "mock123",
};

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
    id: "mockId1",
    email: "mockEmail1",
    password: "mockPw1",
    role: "TEACHER",
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

  // mock course's members
  const mockMembers = [
    {
      id: "mockId1",
      email: "mockEmail1",
      role: "TEACHER",
    },
    {
      id: "mockId2",
      email: "mockEmail2",
      role: "STUDENT",
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
      members: mockMembers,
      questions: mockQuestions,
      announcements: mockAnnouncements,
    }),
  };
});

// beforeEach(() => {
//     // mock server action getCourseInfo
//     jest.mock('@/actions/getCourseInfo', () => ({
//         getCourseInfo: jest.fn().mockResolvedValue({
//             id: 'mockSchoolId_mock123',
//             code: 'mock123',
//             name: 'mockCourse',
//             creator_id: 'mockCreatorId',
//             school_id: 'mockSchoolId',
//             members: mockMembers,
//             questions: mockQuestions,
//         }),
//     }))
// })

it("renders teacher's course page unchanged", async () => {
  const result = await CourseView({ params: mockCourseIdParam });
  const { container } = render(result);
  expect(container).toMatchSnapshot();
});
