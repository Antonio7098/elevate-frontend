import React, { useCallback, useRef, useEffect } from 'react';
import type { Block } from "@blocknote/core";
import { BlockNoteEditor as CoreBlockNoteEditor, defaultBlockSpecs } from "@blocknote/core";
import { BlockNoteViewRaw, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import styles from './BlockNoteEditor.module.css';
import { InsightCatalystBlockSpec } from "./blocks/InsightCatalystBlock";
import type { NoteBlock, CatalystBlock, CustomBlock as NoteCustomBlock } from '../../types/note.types';

// Create a schema that includes all default blocks and our custom block
const customSchema = {
  ...defaultBlockSpecs,
  insightCatalyst: InsightCatalystBlockSpec,
} as unknown;

// Define a type for our editor based on our custom schema
export type CustomEditor = CoreBlockNoteEditor<typeof customSchema>;
export type CustomBlock = Block<typeof customSchema>;

interface BlockNoteEditorProps {
  content: NoteBlock[];
  onContentChange: (blocks: NoteBlock[]) => void;
  editable?: boolean;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("BlockNoteEditor error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorFallback}>
          <h3>Something went wrong.</h3>
          <p>Please try refreshing the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const convertToCustomBlock = (block: NoteBlock): CustomBlock => {
  console.log('Converting block to CustomBlock:', block);
  if (block.type === 'insightCatalyst') {
    const catalystBlock = block as CatalystBlock;
    console.log('Converting catalyst block:', catalystBlock);
    const customBlock = {
      id: catalystBlock.id,
      type: 'insightCatalyst',
      props: {
        catalystType: catalystBlock.props.type || 'insight',
        text: catalystBlock.content || '', // Get text from content
      },
      content: undefined,
    } as unknown as CustomBlock;
    console.log('Converted catalyst block:', customBlock);
    return customBlock;
  }
  const customBlock = block as NoteCustomBlock;
  // Transform string content into the format BlockNote expects
  const content = typeof customBlock.content === 'string' 
    ? [{ type: 'text', text: customBlock.content }]
    : customBlock.content;
    
  return {
    id: customBlock.id,
    type: customBlock.type,
    content,
    props: {
      backgroundColor: 'default',
      textColor: 'default',
      textAlignment: 'left',
    },
  } as unknown as CustomBlock;
};

const convertToNoteBlock = (block: CustomBlock): NoteBlock => {
  console.log('Converting to NoteBlock:', block);
  if (block.type === 'insightCatalyst') {
    return {
      id: block.id || crypto.randomUUID(),
      type: 'insightCatalyst',
      content: block.props.text || '', // Store text in content
      props: {
        type: block.props.catalystType || 'insight',
        text: block.props.text || '', // Also store text in props
        metadata: {
          importance: 1,
          status: 'active',
          tags: [],
        },
      },
    };
  }
  return {
    id: block.id || crypto.randomUUID(),
    type: block.type as NoteCustomBlock['type'],
    content: block.content || '',
    props: {},
  };
};

export const BlockNoteEditor: React.FC<BlockNoteEditorProps> = ({
  content,
  onContentChange,
  editable = true,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  console.log('BlockNoteEditor - Initial content:', content);
  console.log('BlockNoteEditor - Editable:', editable);

  const editor = useCreateBlockNote({
    initialContent: content.map(convertToCustomBlock),
    schema: customSchema,
  });

  useEffect(() => {
    console.log('BlockNoteEditor - Editor instance:', editor);
    console.log('BlockNoteEditor - Current document:', editor.document);
  }, [editor]);

  // Handler to insert a new Insight Catalyst block at the current selection
  const handleInsertCatalyst = useCallback(() => {
    if (!editable) {
      console.log('BlockNoteEditor - Insert catalyst blocked: not editable');
      return;
    }
    const cursor = editor.getTextCursorPosition();
    console.log('BlockNoteEditor - Current cursor position:', cursor);
    if (cursor) {
      const newBlock: CatalystBlock = {
        id: crypto.randomUUID(),
        type: 'insightCatalyst',
        content: 'New insight catalyst...',
        props: {
          type: 'insight',
          text: 'New insight catalyst...', // Add text to props
          metadata: {
            importance: 1,
            status: 'active',
            tags: [],
          },
        },
      };
      console.log('BlockNoteEditor - Inserting new catalyst block:', newBlock);
      editor.insertBlocks(
        [convertToCustomBlock(newBlock)],
        cursor.block,
        'after'
      );
      onContentChange([...content, newBlock]);
    }
  }, [editor, editable, content, onContentChange]);

  // Keyboard shortcuts handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!editable) {
        console.log('BlockNoteEditor - Keydown blocked: not editable');
        return;
      }
      const isMac = /Mac/i.test(navigator.userAgent);
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;
      // Save shortcut
      if (ctrlOrCmd && e.key.toLowerCase() === 's') {
        e.preventDefault();
        console.log('BlockNoteEditor - Save shortcut triggered');
        const blocks = editor.document.map(convertToNoteBlock);
        console.log('BlockNoteEditor - Saving blocks:', blocks);
        onContentChange(blocks);
      }
      // Insert Insight Catalyst shortcut
      if (ctrlOrCmd && e.shiftKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        console.log('BlockNoteEditor - Insert catalyst shortcut triggered');
        handleInsertCatalyst();
      }
    },
    [editor, onContentChange, handleInsertCatalyst, editable]
  );

  return (
    <div
      className="card"
      ref={editorRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {editable && (
        <div style={{ marginBottom: '1rem' }}>
          <button className={styles.createButton} onClick={handleInsertCatalyst}>
            Add Insight Catalyst
          </button>
        </div>
      )}
      <ErrorBoundary>
        <BlockNoteViewRaw
          editor={editor}
          theme="light"
          className={styles.editor}
          onChange={() => {
            console.log('BlockNoteEditor - Content changed');
            const blocks = editor.document.map(convertToNoteBlock);
            console.log('BlockNoteEditor - New blocks:', blocks);
            onContentChange(blocks);
          }}
          editable={editable}
        />
      </ErrorBoundary>
    </div>
  );
}; 