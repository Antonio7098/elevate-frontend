import React from 'react';
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";

import { type CustomBlock, schema } from "../../lib/blocknote/schema"; // Import schema

interface NoteEditorProps {
  initialContent?: CustomBlock[];
  onContentChange: (blocks: CustomBlock[]) => void;
  editable?: boolean;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  initialContent = [], // Default to empty array if undefined
  onContentChange,
  editable = true, // Default to true if not provided
}) => {
  console.log('[NoteEditor] Received initialContent:', JSON.stringify(initialContent, null, 2));
  console.log('[NoteEditor] Editable state:', editable);

  const editor = useCreateBlockNote({
    schema,
    initialContent: initialContent,
  });

  return (
    <BlockNoteView
      editor={editor}
      editable={editable}
      onChange={() => {
        onContentChange(editor.document as CustomBlock[]); // Cast to CustomBlock[]
      }}
      data-testid="blocknote-editor"
    />
  );
};