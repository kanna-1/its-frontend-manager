/**
 * @jest-environment node
 */
import { getSchools } from "@/actions/getSchools";
import { prismaMock } from "@/prisma-mock";

describe("/actions/getSchools", () => {
  test("should return the list of all schools", async () => {
    const schools = [
      { id: "inst001", name: "National University of Singapore" },
      { id: "inst002", name: "Nanyang Technological University" },
    ];
    prismaMock.school.findMany.mockResolvedValue(schools);

    // Call the function
    const school = await getSchools();
    expect(school).toEqual(schools);
  });

  test("should return error", async () => {
    prismaMock.school.findMany.mockRejectedValue(new Error());

    // Call the function
    const school = await getSchools();
    expect(school).toBeNull();
  });
});
