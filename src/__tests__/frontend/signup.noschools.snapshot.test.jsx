import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import SignUpView from "@/app/(auth)/signup/page";

// mock server action getSchools that returns nothing
jest.mock("@/actions/getSchools", () => ({
  getSchools: jest.fn().mockResolvedValue(),
}));

it("renders signup page unchanged", async () => {
  const result = await SignUpView();
  const { container } = render(result);
  expect(container).toMatchSnapshot();
});
