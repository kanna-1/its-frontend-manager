"use server";

import prisma from "@/lib/prisma";
import { School } from "@prisma/client";

export async function getSchools(): Promise<School[] | null> {
  try {
    const schools = await prisma.school.findMany();
    return schools;
  } catch (error) {
    console.error(error);
    return null;
  }
}
