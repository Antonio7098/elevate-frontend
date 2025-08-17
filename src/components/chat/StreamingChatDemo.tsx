import { useState } from 'react';
import { StreamingChatSidebar } from './StreamingChatSidebar';
import styles from './StreamingChatDemo.module.css';

export const StreamingChatDemo = () => {
  const [activeTab, setActiveTab] = useState<'streaming' | 'traditional'>('streaming');
  const [noteId] = useState('demo-note-123');

  return (
    <div className={styles.demoContainer}>
      <div className={styles.header}>
        <h1>AI Chatbot with Real-Time Status Updates</h1>
        <p>Experience the difference between traditional and streaming chat responses</p>
      </div>

      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${activeTab === 'streaming' ? styles.active : ''}`}
          onClick={() => setActiveTab('streaming')}
        >
          🚀 Streaming Chat (Real-Time Updates)
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'traditional' ? styles.active : ''}`}
          onClick={() => setActiveTab('traditional')}
        >
          📝 Traditional Chat
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'streaming' ? (
          <div className={styles.streamingSection}>
            <div className={styles.infoPanel}>
              <h3>✨ Streaming Chat Features</h3>
              <ul>
                <li><strong>Real-time Pipeline Status:</strong> See each stage of the AI processing</li>
                <li><strong>Progress Tracking:</strong> Visual progress bar showing completion</li>
                <li><strong>Stage Details:</strong> Detailed information about each processing step</li>
                <li><strong>Live Updates:</strong> Watch as the AI processes your query</li>
                <li><strong>Performance Metrics:</strong> See confidence scores and response metadata</li>
              </ul>
              
              <div className={styles.pipelineInfo}>
                <h4>🤖 AI Pipeline Stages:</h4>
                <ol>
                  <li><strong>Query Transformation:</strong> Understands and expands your question</li>
                  <li><strong>Context Assembly:</strong> Gathers relevant information from knowledge base</li>
                  <li><strong>Response Generation:</strong> Creates AI response using gathered context</li>
                </ol>
              </div>
            </div>
            
            <div className={styles.chatContainer}>
              <StreamingChatSidebar noteId={noteId} />
            </div>
          </div>
        ) : (
          <div className={styles.traditionalSection}>
            <div className={styles.infoPanel}>
              <h3>📝 Traditional Chat</h3>
              <p>This is how traditional chatbots work - you send a message and wait for the complete response.</p>
              <ul>
                <li>❌ No real-time feedback</li>
                <li>❌ No progress indication</li>
                <li>❌ No visibility into AI processing</li>
                <li>❌ Longer perceived wait times</li>
              </ul>
              
              <div className={styles.comparison}>
                <h4>🔄 Comparison:</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th>Traditional</th>
                      <th>Streaming</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Real-time updates</td>
                      <td>❌</td>
                      <td>✅</td>
                    </tr>
                    <tr>
                      <td>Progress tracking</td>
                      <td>❌</td>
                      <td>✅</td>
                    </tr>
                    <tr>
                      <td>Pipeline visibility</td>
                      <td>❌</td>
                      <td>✅</td>
                    </tr>
                    <tr>
                      <td>User engagement</td>
                      <td>Low</td>
                      <td>High</td>
                    </tr>
                    <tr>
                      <td>Perceived performance</td>
                      <td>Slow</td>
                      <td>Fast</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className={styles.placeholder}>
              <div className={styles.placeholderContent}>
                <h3>Traditional Chat Interface</h3>
                <p>This would show a traditional chat interface where you send a message and wait for the complete response.</p>
                <div className={styles.placeholderChat}>
                  <div className={styles.placeholderMessage}>
                    <div className={styles.placeholderAvatar}>👤</div>
                    <div className={styles.placeholderText}>User message here...</div>
                  </div>
                  <div className={styles.placeholderMessage}>
                    <div className={styles.placeholderAvatar}>🤖</div>
                    <div className={styles.placeholderText}>AI response would appear here after processing...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.features}>
        <h2>🚀 Key Benefits of Streaming Chat</h2>
        <div className={styles.featureGrid}>
          <div className={styles.feature}>
            <h3>⚡ Real-Time Feedback</h3>
            <p>See exactly what the AI is doing at each step, eliminating the "black box" feeling</p>
          </div>
          <div className={styles.feature}>
            <h3>📊 Progress Transparency</h3>
            <p>Visual progress indicators show how much of the processing is complete</p>
          </div>
          <div className={styles.feature}>
            <h3>🔍 Process Visibility</h3>
            <p>Understand the AI's reasoning process through detailed stage information</p>
          </div>
          <div className={styles.feature}>
            <h3>💡 Better User Experience</h3>
            <p>Users feel more engaged and informed about what's happening</p>
          </div>
          <div className={styles.feature}>
            <h3>⚙️ Performance Insights</h3>
            <p>See confidence scores, token usage, and processing times</p>
          </div>
          <div className={styles.feature}>
            <h3>🎯 Context Awareness</h3>
            <p>Understand how the AI is gathering and using relevant information</p>
          </div>
        </div>
      </div>
    </div>
  );
};
