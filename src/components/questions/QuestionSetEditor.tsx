import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";
import type { BlockSchemaFromSpecs } from '@blocknote/core';
import { type CustomBlock, type FullCustomBlock, schema, customBlockSpecs } from "../../lib/blocknote/schema";
import EnhancedChatInput from "../chat/EnhancedChatInput";
import styles from "./QuestionSetEditor.module.css";

interface QuestionSetEditorProps {
  initialContent?: (CustomBlock | FullCustomBlock)[];
  onContentChange: (blocks: FullCustomBlock[]) => void;
  editable?: boolean;
  questionSetName?: string;
  onNameChange?: (name: string) => void;
  onChatMessage?: (message: string) => void;
  isLoading?: boolean;
}

export const QuestionSetEditor = ({
  initialContent = [],
  onContentChange,
  editable = true,
  questionSetName = '',
  onNameChange,
  onChatMessage,
  isLoading = false,
}: QuestionSetEditorProps) => {
  console.log('[QuestionSetEditor] Received initialContent:', JSON.stringify(initialContent, null, 2));
  console.log('[QuestionSetEditor] Editable state:', editable);

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

  const handleChatMessage = (message: string, mode?: string, attachments?: File[]) => {
    console.log('Chat message:', message, 'Mode:', mode, 'Attachments:', attachments);
    if (onChatMessage) {
      onChatMessage(message);
    } else {
      // Default chat handler - you can customize this
      console.log('Default chat handler:', message);
    }
  };

  return (
    <div className={styles.questionSetEditorContainer}>
      {/* Header with name input */}
      {editable && onNameChange && (
        <div className={styles.header}>
          <div className={styles.nameInputContainer}>
            <label htmlFor="question-set-name" className={styles.nameLabel}>
              Question Set Name
            </label>
            <input
              id="question-set-name"
              type="text"
              value={questionSetName}
              onChange={(e) => onNameChange(e.target.value)}
              className={styles.nameInput}
              placeholder="Enter question set name..."
            />
          </div>
        </div>
      )}

      {/* Editor Content Area */}
      <div className={styles.editorContent}>
        {editable && (
          <div className={styles.contentLabel}>
            Question Set Content
          </div>
        )}
        <BlockNoteView
          editor={editor}
          editable={editable}
          onChange={() => {
            onContentChange(editor.document);
          }}
          data-testid="blocknote-editor"
        />
      </div>

      {/* Chat Input Area - Always visible like in ChatPage */}
      <div className={styles.chatInputArea}>
        <EnhancedChatInput 
          onSendMessage={handleChatMessage}
          isLoading={isLoading}
          placeholder="Ask about this question set or request changes..."
        />
      </div>
    </div>
  );
};

