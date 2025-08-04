import React from 'react';
import ActionBox, { type ActionType } from './ActionBox';

interface Action {
  id: string;
  type: ActionType;
  title: string;
  description: string;
  fileName?: string;
  changes?: string;
}

interface MessageWithActionsProps {
  message: string;
  actions?: Action[];
  onActionAccept?: (actionId: string) => void;
  onActionReject?: (actionId: string) => void;
}

const MessageWithActions: React.FC<MessageWithActionsProps> = ({
  message,
  actions = [],
  onActionAccept,
  onActionReject
}) => {
  // Parse message to detect action patterns
  const parseMessageForActions = (text: string): { text: string; detectedActions: Action[] } => {
    const detectedActions: Action[] = [];
    let parsedText = text;

    // Pattern to detect file creation/editing mentions
    const fileActionPattern = /I(?:'ve|'ll| will| have) (creat(?:ed?|ing)|updat(?:ed?|ing)|edit(?:ed?|ing)|modif(?:ied?|ying)) (?:the )?(?:file )?`?([^`\s]+\.(?:tsx?|jsx?|css|html|json|md))`?/gi;
    
    let match;
    while ((match = fileActionPattern.exec(text)) !== null) {
      const [, actionWord, fileName] = match;
      const actionType: ActionType = actionWord.toLowerCase().includes('creat') ? 'create' : 'edit';
      
      detectedActions.push({
        id: `${actionType}-${fileName}-${Date.now()}`,
        type: actionType,
        title: `${actionType === 'create' ? 'Create' : 'Update'} ${fileName}`,
        description: `${actionType === 'create' ? 'Create a new file' : 'Update the existing file'}: ${fileName}`,
        fileName,
        changes: `// ${actionType === 'create' ? 'New file' : 'Updated file'}: ${fileName}\n// Changes will be shown here when implemented`
      });
    }

    return { text: parsedText, detectedActions };
  };

  const { text, detectedActions } = parseMessageForActions(message);
  const allActions = [...detectedActions, ...actions];

  const handleAccept = (actionId: string) => {
    console.log(`Action accepted: ${actionId}`);
    onActionAccept?.(actionId);
  };

  const handleReject = (actionId: string) => {
    console.log(`Action rejected: ${actionId}`);
    onActionReject?.(actionId);
  };

  return (
    <div>
      <div style={{ marginBottom: allActions.length > 0 ? '1rem' : '0' }}>
        {text}
      </div>
      
      {allActions.map((action) => (
        <ActionBox
          key={action.id}
          actionType={action.type}
          title={action.title}
          description={action.description}
          fileName={action.fileName}
          changes={action.changes}
          onAccept={() => handleAccept(action.id)}
          onReject={() => handleReject(action.id)}
        />
      ))}
    </div>
  );
};

export default MessageWithActions;
