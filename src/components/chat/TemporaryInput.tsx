
import React, { useState } from 'react';
import { FiSend, FiLoader } from 'react-icons/fi';
import styles from './TemporaryInput.module.css';

interface TemporaryInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const TemporaryInput: React.FC<TemporaryInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.inputForm}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className={styles.input}
        placeholder="Type a message..."
        disabled={isLoading}
      />
      <button
        type="submit"
        className={styles.sendButton}
        disabled={!inputValue.trim() || isLoading}
      >
        {isLoading ? <FiLoader className={styles.loadingSpinner} /> : <FiSend />}
      </button>
    </form>
  );
};

export default TemporaryInput;
