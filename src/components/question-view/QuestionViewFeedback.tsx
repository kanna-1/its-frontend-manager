import React from "react";

export type FeedbackType = {
  lineNumber: number;
  oldExpr: string;
  newExpr: string;
  repairStrings: string[];
};

export default function QuestionViewFeedback({
  feedbacks,
}: {
  feedbacks: FeedbackType[];
}): React.JSX.Element {
  return (
    <div className="flex flex-col h-3/4 space-y-2 ml-4">
      <h4 className="font-medium">Feedback Console</h4>
      <div className="max-h-48 rounded-md bg-secondary p-4 space-y-2 overflow-auto">
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback, index) => (
            <div key={index}>
              <p className="font-medium">Line Number: {feedback.lineNumber}</p>
              <p>Old Expression: {feedback.oldExpr}</p>
              <p>New Expression: {feedback.newExpr}</p>
              <p>
                Possible Repair:{" "}
                {feedback.repairStrings.length > 0 ? (
                  feedback.repairStrings.map((repair, index) => (
                    <span key={index}>{repair}</span>
                  ))
                ) : (
                  <span>No repair suggestion</span>
                )}
              </p>
            </div>
          ))
        ) : (
          <p>No feedback given</p>
        )}
      </div>
    </div>
  );
}
