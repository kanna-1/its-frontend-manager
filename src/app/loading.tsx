import React from "react";

export default function Loading(): React.JSX.Element {
  return (
    <div className="text-center mt-64">
      <svg
        className="inline ml-2 animate-spin h-16 w-16 rounded-full border-4 border-solid border-current border-r-transparent"
        viewBox="0 0 64 64"
      ></svg>
      <p className="mt-4">Loading ...</p>
    </div>
  );
}
