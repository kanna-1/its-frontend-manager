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
}) {
  return (
    <div className="flex flex-col space-y-2 ml-4 h-2/3">
      <h4 className="font-medium">Feedback Console</h4>
      <div className="rounded-md bg-secondary p-4">
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback, index) => (
            <div key={index}>
              <p>Line Number: {feedback.lineNumber}</p>
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
