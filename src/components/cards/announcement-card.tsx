import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  type AnnouncementCardProps = {
    announcementTitle: string;
    announcementBody: string;
    announcementDate: string; // Assuming announcementDate is a string
  };
  
  export default function AnnouncementCard({
    announcementTitle,
    announcementBody,
    announcementDate,
  }: AnnouncementCardProps) {
    return (
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>{announcementTitle}</CardTitle>
          {announcementDate && (
            <p className="text-sm text-gray-500">{announcementDate}</p>
          )}
        </CardHeader>
        <CardContent className="flex-1">
          <CardDescription>{announcementBody}</CardDescription>
        </CardContent>
      </Card>
    );
  }