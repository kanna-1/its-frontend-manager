import React from "react";

export default async function SubmissionViewFeedback({
  feedback,
  grade,
}: {
  feedback: string;
  grade: number;
}): Promise<React.JSX.Element> {
  return (
    <div className="flex flex-col space-y-4">
      <h4 className="font-medium text-xl">Feedback</h4>
      <p>{feedback || "No feedback given"}</p>
      <h4 className="font-medium text-xl">Grade</h4>
      <p>{grade < 0 ? "No grade given" : `${grade} / 100`}</p>
    </div>
  );
}
