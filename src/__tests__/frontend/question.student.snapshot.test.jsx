import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import QuestionView from '@/app/courses/[courseId]/[questionId]/page'

// mock useRouter
jest.mock("next/navigation", () => ({
    useRouter() {
      return {
        prefetch: () => null
      };
    }
  }));

// mock courseId param
const mockQuestionParams = {
    questionId: 'mockQuestionId',
    courseId: 'mock123'
}
  
// mock server action getUserProps
jest.mock('@/actions/getUserProps', () => {

    // mock student submissions
    const mockSubmissions = [{
        id: 'mockSubmissionId',
        questionId: 'mockQuestionId',
        user_id: 'mockId1',
        submitted_program: 'mockProgram',
        feedback: '',
        grade: 0,
    }]

    return {
        getUserProps: jest.fn().mockResolvedValue({
            id: 'mockId1',
            email: 'mockEmail1',
            password: 'mockPw1',
            role: 'STUDENT',
            school_id: 'mockSchoolId',
            submissions: mockSubmissions,
        }),
    }
    
})

// mock server action getQuestionInfo
jest.mock('@/actions/getQuestionInfo', () => {

    return {
        getQuestionInfo: jest.fn().mockResolvedValue({
            id: 'mockQuestionId',
            title: 'mockQuestion',
            description: 'mockDescription',
            reference_program: '',
            courseId: 'mockSchoolId_mock123',
            course: {
                code: 'mock123'
            }
        })
    }    
})

it("renders student's question page unchanged", async () => {
    const result = await QuestionView({ params: mockQuestionParams })
    const { container } = render(result);
    expect(container).toMatchSnapshot();
  });