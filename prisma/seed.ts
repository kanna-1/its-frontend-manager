import { hash } from "bcryptjs";
import prisma from "../src/lib/prisma";
import { Role } from "@prisma/client";

// TODO: Place in env file
const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "password123";
const DEFAULT_PASSWORD = "password1";

async function main() {
  // const delete_submissions = prisma.submission.deleteMany({});
  // const delete_questions = prisma.question.deleteMany({});
  // const delete_courses = prisma.course.deleteMany({});

  // prisma.$transaction([delete_submissions, delete_questions, delete_courses])

  const all_schools = prisma.school.createMany({
    data: [
      { id: "inst001", name: "National University of Singapore" },
      { id: "inst002", name: "Nanyang Technological University" },
      { id: "inst003", name: "Singapore Management University" },
      { id: "inst004", name: "Singapore Institute of Management" },
      { id: "inst005", name: "Singapore University of Technology and Design" },
    ],
    skipDuplicates: true,
  });
  const admin_user = prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      email: ADMIN_EMAIL,
      password: await hash(ADMIN_PASSWORD, 12),
      role: Role.ADMIN,
      school: {
        connect: {
          id: "inst001",
        },
      },
    },
  });

  const teacher_users = prisma.user.createMany({
    data: [
      {
        email: "teacher1@test.com",
        password: await hash(DEFAULT_PASSWORD, 12),
        role: Role.TEACHER,
        school_id: "inst001",
      },
      {
        email: "teacher2@test.com",
        password: await hash(DEFAULT_PASSWORD, 12),
        role: Role.TEACHER,
        school_id: "inst001",
      },
    ],
    skipDuplicates: true,
  });

  const student_users = prisma.user.createMany({
    data: [
      {
        email: "student1@test.com",
        password: await hash(DEFAULT_PASSWORD, 12),
        role: Role.STUDENT,
        school_id: "inst001",
      },
      {
        email: "student2@test.com",
        password: await hash(DEFAULT_PASSWORD, 12),
        role: Role.STUDENT,
        school_id: "inst001",
      },
      {
        email: "student3@test.com",
        password: await hash(DEFAULT_PASSWORD, 12),
        role: Role.STUDENT,
        school_id: "inst001",
      },
    ],
    skipDuplicates: true,
  });

  prisma.$transaction([all_schools, admin_user, teacher_users, student_users]);
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
