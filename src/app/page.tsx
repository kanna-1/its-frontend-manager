import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function RootPage(): Promise<void> {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    redirect("/signin");
  } else {
    redirect("/courses")
  }
}
