import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@prisma/client";
import { ClipboardCheck } from "lucide-react";

export default function CourseCard({
  course,
  isCreator,
}: {
  course: Course;
  isCreator: boolean;
}) {
  return (
    <Card className="min-w-64 min-h-32">
      <CardHeader>
        <CardTitle className="flex space-x-2">
          <span>{course.code}</span>{isCreator && <ClipboardCheck />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <h4 className="font-medium">{course.name}</h4>
      </CardContent>
    </Card>
  );
}
