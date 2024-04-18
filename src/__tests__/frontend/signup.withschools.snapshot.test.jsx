import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import SignUpView from "@/app/(auth)/signup/page";

// mock server action getSchools
jest.mock("@/actions/getSchools", () => ({
  getSchools: jest.fn().mockResolvedValue([
    {
      id: "mockSchoolId",
      name: "mockSchoolName",
      user: [],
      courses: [],
    },
  ]),
}));

it("renders signup page unchanged", async () => {
  const result = await SignUpView();
  const { container } = render(result);
  expect(container).toMatchSnapshot();
});
