import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './NewSidebar.module.css'; // Use new module for new styles
import { FiSearch, FiPlus, FiMessageSquare, FiFolder, FiBook, FiSettings, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/useAuth';

interface NewSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const NewSidebar: React.FC<NewSidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Placeholder data for recent chats, folders, and question sets
  const recentChats = [
    { id: 'chat1', name: 'Project Alpha Discussion' },
    { id: 'chat2', name: 'Meeting Notes - 2025-07-30' },
    { id: 'chat3', name: 'Brainstorming Session' },
  ];

  const folders = [
    { id: 'folder1', name: 'Work Documents' },
    { id: 'folder2', name: 'Personal Projects' },
  ];

  const questionSets = [
    { id: 'qs1', name: 'React Interview Prep' },
    { id: 'qs2', name: 'Advanced Algorithms' },
  ];

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.logo}>Elevate</h2>
        <button onClick={toggleSidebar} className={styles.closeButton}>
          &times;
        </button>
      </div>

      <div className={styles.searchContainer}>
        <FiSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.newChatButtonContainer}>
        <Link to="/chat/new" className={styles.newChatButton} onClick={toggleSidebar}>
          <FiPlus className={styles.newChatIcon} />
          New Chat
        </Link>
      </div>

      <nav className={styles.navigation}>
        <div className={styles.navSection}>
          <h3 className={styles.navSectionTitle}>Recent Chats</h3>
          {recentChats.map(chat => (
            <Link key={chat.id} to={`/chat/${chat.id}`} className={styles.navItem} onClick={toggleSidebar}>
              <FiMessageSquare className={styles.navIcon} />
              {chat.name}
            </Link>
          ))}
        </div>

        <div className={styles.navSection}>
          <h3 className={styles.navSectionTitle}>Folders</h3>
          {folders.map(folder => (
            <Link key={folder.id} to={`/folders/${folder.id}`} className={styles.navItem} onClick={toggleSidebar}>
              <FiFolder className={styles.navIcon} />
              {folder.name}
            </Link>
          ))}
        </div>

        <div className={styles.navSection}>
          <h3 className={styles.navSectionTitle}>Question Sets</h3>
          {questionSets.map(qs => (
            <Link key={qs.id} to={`/question-sets/${qs.id}`} className={styles.navItem} onClick={toggleSidebar}>
              <FiBook className={styles.navIcon} />
              {qs.name}
            </Link>
          ))}
        </div>
      </nav>

      <div className={styles.sidebarFooter}>
        <Link to="/profile" className={styles.navItem} onClick={toggleSidebar}>
          <FiUser className={styles.navIcon} />
          Profile
        </Link>
        <Link to="/settings" className={styles.navItem} onClick={toggleSidebar}>
          <FiSettings className={styles.navIcon} />
          Settings
        </Link>
        <button onClick={logout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default NewSidebar;
