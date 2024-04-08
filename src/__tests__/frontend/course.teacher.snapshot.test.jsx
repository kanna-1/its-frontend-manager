import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import CourseView from '@/app/courses/[courseId]/page'

// mock courseId param
const mockCourseIdParam = {
    courseId: 'mock123'
}
  
// mock server action getUserProps
jest.mock('@/actions/getUserProps', () => ({
    getUserProps: jest.fn().mockResolvedValue({
        id: 'mockId1',
        email: 'mockEmail1',
        password: 'mockPw1',
        role: 'TEACHER',
        school_id: 'mockSchoolId',
    }),
}))

// mock server action getCourseInfo
jest.mock('@/actions/getCourseInfo', () => {
    // mock course's questions
    const mockQuestions = [{
        id: 'mockQuestionId1',
        title: 'mockQuestion',
        description: 'mockDescription',
        reference_program: '',
        courseId: 'mockSchoolId_mock123'
    }]

    // mock course's members
    const mockMembers = [
        {
            id: 'mockId1',
            email: 'mockEmail1',
            role: 'TEACHER',
        },
        {
            id: 'mockId2',
            email: 'mockEmail2',
            role: 'STUDENT',
        }
    ]
    
    return {
        getCourseInfo: jest.fn().mockResolvedValue({
            id: 'mockSchoolId_mock123',
            code: 'mock123',
            name: 'mockCourse',
            creator_id: 'mockCreatorId',
            school_id: 'mockSchoolId',
            members: mockMembers,
            questions: mockQuestions,
        }),
    }
})

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

it("renders admin's user management page unchanged", async () => {
    const result = await CourseView({ params: mockCourseIdParam })
    const { container } = render(result);
    expect(container).toMatchSnapshot();
  });