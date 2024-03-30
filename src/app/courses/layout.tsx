import { getUserProps } from "@/actions/getUserProps";
import NavigationBar from "@/components/navigation-bar";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserProps({
    includeSchool: true,
    includeCourses: false,
    includeSubmissions: false,
  });
  return (
    <main>
      <NavigationBar user={user}></NavigationBar>
      <div className="p-4">{children}</div>
    </main>
  );
}
