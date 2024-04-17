import React from "react";
import { getUserProps } from "@/actions/getUserProps";
import NavigationBar from "@/components/navigationBar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element> {
  const user = await getUserProps({
    include_school: true,
    include_courses: false,
    include_submissions: false,
  });
  return (
    <main>
      <NavigationBar user={user}></NavigationBar>
      <div className="p-4">{children}</div>
    </main>
  );
}
