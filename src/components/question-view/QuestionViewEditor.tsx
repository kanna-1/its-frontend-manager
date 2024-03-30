import React, { useRef } from "react";
import Editor from "@monaco-editor/react";

export default function QuestionViewEditor({
  handleEditorChange,
  language,
}: {
  handleEditorChange: (value: string | undefined) => void;
  language: string;
}) {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  return (
    <Editor
      language="python"
      defaultValue={`\n\n\n\n\n\n\n\n\n\n`}
      onChange={handleEditorChange}
      height="100%"
      width="100%"
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
}
