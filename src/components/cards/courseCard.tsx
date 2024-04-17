import React from "react";
import { Course } from "@prisma/client";
import { ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CourseCard({
  course,
  isCreator,
}: {
  course: Course;
  isCreator: boolean;
}): React.JSX.Element {
  return (
    <Card className="h-40">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>{course.code}</span>
          {isCreator && (
            <ClipboardCheck size={17} style={{ marginBottom: 2 }} />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <h4 className="font-medium">{course.name}</h4>
      </CardContent>
    </Card>
  );
}
