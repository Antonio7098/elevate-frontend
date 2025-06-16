
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";
import type { BlockSchemaFromSpecs } from '@blocknote/core';
import { type CustomBlock, type FullCustomBlock, schema, customBlockSpecs } from "../../lib/blocknote/schema"; // Import schema

interface NoteEditorProps {
  initialContent?: (CustomBlock | FullCustomBlock)[];
  onContentChange: (blocks: FullCustomBlock[]) => void;
  editable?: boolean;
}

export const NoteEditor = ({
  initialContent = [], // Default to empty array if undefined
  onContentChange,
  editable = true, // Default to true if not provided
}: NoteEditorProps) => {
  console.log('[NoteEditor] Received initialContent:', JSON.stringify(initialContent, null, 2));
  console.log('[NoteEditor] Editable state:', editable);

  const editor = useCreateBlockNote<BlockSchemaFromSpecs<typeof customBlockSpecs>>({
    schema,
    initialContent: initialContent,
  });

  return (
    <BlockNoteView
      editor={editor}
      editable={editable}
      onChange={() => {
        onContentChange(editor.document);
      }}
      data-testid="blocknote-editor"
    />
  );
};