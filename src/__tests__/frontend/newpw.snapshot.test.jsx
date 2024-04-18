import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import ResetPasswordView from "@/app/(auth)/new-password/page";

// mock useSearchParams
jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams({ token: "mockToken" }),
}));

it("renders new password page unchanged", async () => {
  const result = await ResetPasswordView();
  const { container } = render(result);
  expect(container).toMatchSnapshot();
});
