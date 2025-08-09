import React, { useState, useRef, useEffect } from 'react';
import { FiPlus, FiSend, FiUpload, FiChevronDown } from 'react-icons/fi';
import styles from './EnhancedChatInput.module.css';

interface Mode {
  id: string;
  label: string;
  description?: string;
}

interface EnhancedChatInputProps {
  onSendMessage: (message: string, mode?: string, attachments?: File[]) => void;
  isLoading?: boolean;
  placeholder?: string;
  fullWidth?: boolean; // NEW: stretch to container width
}

const modes: Mode[] = [
  { id: 'quiz', label: 'Quiz', description: 'Generate quiz questions' },
  { id: 'walkthrough', label: 'Walkthrough', description: 'Step-by-step guidance' },
  { id: 'deep-dive', label: 'Deep Dive', description: 'Detailed analysis' },
  { id: 'chat', label: 'Chat', description: 'General conversation' },
];

const EnhancedChatInput: React.FC<EnhancedChatInputProps> = ({
  onSendMessage,
  isLoading = false,
  placeholder = "Type message here",
  fullWidth = false,
}) => {
  const [message, setMessage] = useState('');
  const [selectedMode, setSelectedMode] = useState<Mode>(modes[0]);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modeDropdownRef = useRef<HTMLDivElement>(null);
  const uploadDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modeDropdownRef.current &&
        !modeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowModeDropdown(false);
      }
      if (
        uploadDropdownRef.current &&
        !uploadDropdownRef.current.contains(event.target as Node)
      ) {
        setShowUploadDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim(), selectedMode.id, attachments);
      setMessage('');
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    setShowUploadDropdown(false);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleModeSelect = (mode: Mode) => {
    setSelectedMode(mode);
    setShowModeDropdown(false);
  };

  return (
    <div className={styles.container}>
      {/* Attachments display */}
      {attachments.length > 0 && (
        <div className={styles.attachments}>
          {attachments.map((file, index) => (
            <div key={index} className={styles.attachment}>
              <span className={styles.fileName}>{file.name}</span>
              <button 
                onClick={() => removeAttachment(index)}
                className={styles.removeAttachment}
                type="button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={`${styles.inputWrapper} ${fullWidth ? styles.fullWidth : ''}`}>
        <div className={styles.inputContainer}>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className={styles.textarea}
            rows={1}
            disabled={isLoading}
          />

          {/* Controls */}
          <div className={styles.controlsRow}>
            {/* Left Actions */}
            <div className={styles.actionsContainer}>
              <div ref={modeDropdownRef} className={styles.actionWrapper}>
                <button
                  onClick={() => {
                    setShowModeDropdown(!showModeDropdown);
                    setShowUploadDropdown(false);
                  }}
                  className={`${styles.actionButton} ${showModeDropdown ? styles.active : ''}`}
                  type="button"
                >
                  <span className={styles.modeLabel}>{selectedMode.label}</span>
                  <FiChevronDown size={16} />
                </button>
                {showModeDropdown && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>Mode</div>
                    {modes.map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => handleModeSelect(mode)}
                        className={`${styles.dropdownItem} ${selectedMode.id === mode.id ? styles.selected : ''}`}
                        type="button"
                      >
                        <div className={styles.dropdownItemContent}>
                          <span className={styles.dropdownItemLabel}>{mode.label}</span>
                          {mode.description && (
                            <span className={styles.dropdownItemDescription}>{mode.description}</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div ref={uploadDropdownRef} className={styles.actionWrapper}>
                <button
                  onClick={() => {
                    setShowUploadDropdown(!showUploadDropdown);
                    setShowModeDropdown(false);
                  }}
                  className={`${styles.actionButton} ${showUploadDropdown ? styles.active : ''}`}
                  type="button"
                >
                  <FiPlus size={20} />
                </button>
                {showUploadDropdown && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>Upload</div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={styles.dropdownItem}
                      type="button"
                    >
                      <FiUpload size={16} />
                      <span>From device</span>
                    </button>
                    <button
                      onClick={() => setShowUploadDropdown(false)}
                      className={styles.dropdownItem}
                      type="button"
                    >
                      <span>Etc</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Send Button */}
            <button
              onClick={handleSend}
              disabled={isLoading || !message.trim()}
              className={`${styles.actionButton} ${styles.sendButton}`}
              type="button"
            >
              <div className={styles.loadingSpinner}>
                <div className={styles.spinner}></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className={styles.hiddenFileInput}
      />
    </div>
  );
};

export default EnhancedChatInput;
