import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import SignInView from "@/app/(auth)/signin/page";

// mock useRouter
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

it("renders signin page unchanged", async () => {
  const result = await SignInView();
  const { container } = render(result);
  expect(container).toMatchSnapshot();
});
