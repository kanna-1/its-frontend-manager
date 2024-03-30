import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import SignUpView from '@/app/(auth)/signup/page'

it("renders signup page unchanged", async () => {
    const result = await SignUpView()
    const { container } = render(result);
    expect(container).toMatchSnapshot();
  });
