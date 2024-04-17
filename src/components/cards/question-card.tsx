import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type QuestionCardProps = {
  question_title: string;
  question_description: string;
};

export default function QuestionCard({
  question_title,
  question_description,
}: QuestionCardProps): React.JSX.Element {
  return (
    <Card className="min-w-64 min-h-32">
      <CardHeader>
        <CardTitle>{question_title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{question_description.slice(0, 40)}...</CardDescription>
      </CardContent>
    </Card>
  );
}
