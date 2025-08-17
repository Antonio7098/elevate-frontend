import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../routes/blueprintRoutes';
import styles from './BreadcrumbNavigation.module.css';

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

interface BreadcrumbNavigationProps {
  className?: string;
  customBreadcrumbs?: BreadcrumbItem[];
}

const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  className = '',
  customBreadcrumbs,
}) => {
  const location = useLocation();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Always start with home
    breadcrumbs.push({
      label: 'Home',
      path: '/',
      isActive: location.pathname === '/',
    });

    if (pathSegments.length === 0) {
      return breadcrumbs;
    }

    // Handle blueprint routes
    if (pathSegments[0] === 'blueprints') {
      breadcrumbs.push({
        label: 'Blueprints',
        path: ROUTES.BLUEPRINTS,
        isActive: location.pathname === ROUTES.BLUEPRINTS,
      });

      if (pathSegments.length > 1) {
        if (pathSegments[1] === 'dashboard') {
          breadcrumbs.push({
            label: 'Dashboard',
            path: ROUTES.BLUEPRINT_DASHBOARD,
            isActive: true,
          });
        } else if (pathSegments[1] === 'sections') {
          breadcrumbs.push({
            label: 'Section Manager',
            path: ROUTES.SECTIONS,
            isActive: true,
          });
        } else if (pathSegments[1] === 'mastery') {
          breadcrumbs.push({
            label: 'Mastery Tracker',
            path: ROUTES.MASTERY,
            isActive: true,
          });
        } else if (pathSegments[1] === 'uue-progression') {
          breadcrumbs.push({
            label: 'UUE Progression',
            path: ROUTES.UUE_PROGRESSION,
            isActive: true,
          });
        } else if (pathSegments[1] === 'pathways') {
          breadcrumbs.push({
            label: 'Learning Pathways',
            path: ROUTES.LEARNING_PATHWAYS,
            isActive: true,
          });
        } else if (pathSegments[1] === 'questions') {
          breadcrumbs.push({
            label: 'Question Bank',
            path: ROUTES.QUESTIONS,
            isActive: true,
          });
        } else if (pathSegments[1] === 'mastery') {
          breadcrumbs.push({
            label: 'Mastery',
            path: ROUTES.MASTERY,
            isActive: true,
          });
        } else if (pathSegments[1] !== 'dashboard') {
          // This is a blueprint ID
          breadcrumbs.push({
            label: 'Blueprint',
            path: `/blueprints/${pathSegments[1]}`,
            isActive: false,
          });

          if (pathSegments.length > 2) {
            const subRoute = pathSegments[2];
            const subRouteLabels: Record<string, string> = {
              'overview': 'Overview',
              'sections': 'Sections',
              'mastery': 'Mastery Tracking',
              'uue-progression': 'UUE Progression',
              'questions': 'Question Bank',
              'mastery': 'Mastery',
            };

            if (subRouteLabels[subRoute]) {
              breadcrumbs.push({
                label: subRouteLabels[subRoute],
                path: `/blueprints/${pathSegments[1]}/${subRoute}`,
                isActive: true,
              });
            }
          }
        }
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={`${styles.breadcrumbNavigation} ${className}`} aria-label="Breadcrumb">
      <ol className={styles.breadcrumbList}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className={styles.breadcrumbItem}>
            {index > 0 && (
              <svg
                className={styles.breadcrumbSeparator}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            
            {breadcrumb.isActive ? (
              <span className={styles.breadcrumbActive}>{breadcrumb.label}</span>
            ) : (
              <Link
                to={breadcrumb.path}
                className={styles.breadcrumbLink}
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbNavigation;
