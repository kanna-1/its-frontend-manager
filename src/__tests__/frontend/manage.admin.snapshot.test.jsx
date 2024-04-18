import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import UserManagementView from "@/app/(admin)/user-management/page";

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
    role: "ADMIN",
    school_id: "mockSchoolId",
    school: {
      name: "mockSchoolName",
    },
  }),
}));

// mock server action getUsers
jest.mock("@/actions/getUsers", () => ({
  getUsers: jest.fn().mockResolvedValue([
    {
      id: "mockId2",
      email: "mockEmail2",
      password: "mockPw2",
      role: "TEACHER",
      school_id: "mockSchoolId",
    },
    {
      id: "mockId3",
      email: "mockEmail3",
      password: "mockPw3",
      role: "STUDENT",
      school_id: "mockSchoolId",
    },
  ]),
}));

it("renders admin's user management page unchanged", async () => {
  const result = await UserManagementView();
  const { container } = render(result);
  expect(container).toMatchSnapshot();
});
