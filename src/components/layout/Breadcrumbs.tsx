import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

interface Breadcrumb {
  label: string;
  to: string;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const path = location.pathname;

  // Build breadcrumb trail for /my-progress, /my-progress/folders/:folderId, /my-progress/sets/:setId
  const crumbs: Breadcrumb[] = [
    { label: 'My Progress', to: '/my-progress' },
  ];
  if (path.startsWith('/my-progress/folders/') && params.folderId) {
    crumbs.push({ label: 'Folder', to: `/my-progress/folders/${params.folderId}` });
  }
  if (path.startsWith('/my-progress/sets/') && params.setId) {
    crumbs.push({ label: 'Set', to: `/my-progress/sets/${params.setId}` });
  }

  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      {crumbs.map((crumb, idx) => (
        <span key={crumb.to}>
          {idx > 0 && <span className={styles.separator}>/</span>}
          {idx < crumbs.length - 1 ? (
            <Link to={crumb.to} className={styles.link}>{crumb.label}</Link>
          ) : (
            <span className={styles.current}>{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
