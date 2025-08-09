
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";
import type { BlockSchemaFromSpecs } from '@blocknote/core';
import { type CustomBlock, type FullCustomBlock, schema, customBlockSpecs } from "../../lib/blocknote/schema";
import styles from "./NoteEditor.module.css";

interface NoteEditorProps {
  initialContent?: (CustomBlock | FullCustomBlock)[];
  onContentChange: (blocks: FullCustomBlock[]) => void;
  editable?: boolean;
}

export const NoteEditor = ({
  initialContent = [],
  onContentChange,
  editable = true,
}: NoteEditorProps) => {
  console.log('[NoteEditor] Received initialContent:', JSON.stringify(initialContent, null, 2));
  console.log('[NoteEditor] Editable state:', editable);

  // Ensure we have at least one block for BlockNote
  const safeInitialContent = initialContent.length > 0 ? initialContent : [
    {
      id: 'default-block',
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '',
          styles: {}
        }
      ],
      props: {}
    } as FullCustomBlock
  ];

  const editor = useCreateBlockNote<BlockSchemaFromSpecs<typeof customBlockSpecs>>({
    schema,
    initialContent: safeInitialContent,
  });

  return (
    <div className={styles.noteEditorContainer}>
      {/* Editor Content Area */}
      <div className={styles.editorContent}>
        <BlockNoteView
          editor={editor}
          editable={editable}
          onChange={() => {
            onContentChange(editor.document);
          }}
          data-testid="blocknote-editor"
        />
      </div>
    </div>
  );
};