import React, { useState } from 'react';

interface Question {
  text: string;
  answer: string;
  type: string;
  marks: string;
  markingScheme: string;
  focus: string;
}

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (question: Question) => void;
}

const FOCUS_OPTIONS = [
  { value: 'understand', label: 'Understand' },
  { value: 'use', label: 'Use' },
  { value: 'explore', label: 'Explore' }
];

const AddQuestionModal: React.FC<AddQuestionModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [text, setText] = useState('');
  const [answer, setAnswer] = useState('');
  const [type, setType] = useState('');
  const [marks, setMarks] = useState('');
  const [markingScheme, setMarkingScheme] = useState('');
  const [focus, setFocus] = useState('understand');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ text, answer, type, marks, markingScheme, focus });
    setText('');
    setAnswer('');
    setType('');
    setMarks('');
    setMarkingScheme('');
    setFocus('understand');
  };

  if (!isOpen) return null;

  return (
    <div className="modalBackdrop">
      <div className="modal">
        <h3>New Question</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Question</label>
            <input value={text} onChange={e => setText(e.target.value)} required />
          </div>
          <div>
            <label>Answer</label>
            <input value={answer} onChange={e => setAnswer(e.target.value)} required />
          </div>
          <div>
            <label>Type (optional)</label>
            <input value={type} onChange={e => setType(e.target.value)} />
          </div>
          <div>
            <label>No. of marks</label>
            <input value={marks} onChange={e => setMarks(e.target.value)} type="number" min={1} />
          </div>
          <div>
            <label>Marking scheme</label>
            <input value={markingScheme} onChange={e => setMarkingScheme(e.target.value)} />
          </div>
          <div>
            <label>Focus</label>
            <select value={focus} onChange={e => setFocus(e.target.value)}>
              {FOCUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionModal; 