import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import ForgotPasswordView from "@/app/(auth)/forgot-password/page";

// mock useRouter
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

it("renders forgot password page unchanged", async () => {
  const result = await ForgotPasswordView();
  const { container } = render(result);
  expect(container).toMatchSnapshot();
});
