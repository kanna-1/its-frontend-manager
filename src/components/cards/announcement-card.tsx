import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Announcement } from "@prisma/client";

export default function AnnouncementCard({
  announcement,
}: {
  announcement: Announcement;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{announcement.title}</CardTitle>
        <p className="text-sm text-gray-500">
          {announcement.time.toDateString()}
        </p>
      </CardHeader>
      <CardContent className="flex-1">
        <CardDescription>{announcement.body}</CardDescription>
      </CardContent>
    </Card>
  );
}
