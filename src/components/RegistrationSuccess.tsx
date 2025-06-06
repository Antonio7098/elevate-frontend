import { useEffect } from 'react';

interface RegistrationSuccessProps {
  email: string;
  onClose: () => void;
}

import styles from './RegistrationSuccess.module.css';

export const RegistrationSuccess = ({ email, onClose }: RegistrationSuccessProps) => {
  useEffect(() => {
    // Auto-close the success message after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={styles.container}>
      <div className={styles.flex}>
        <div className={styles.flexShrink0}>
          <svg
            className={styles.icon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className={styles.ml3}>
          <p className={`${styles.textSm} ${styles.fontMedium} ${styles.textGreen800}`}>
            Registration successful! Welcome, {email}
          </p>
          <p className={`${styles.mt1} ${styles.textSm} ${styles.textGreen700}`}>
            You're now logged in and can start using Elevate.
          </p>
        </div>
        <div className={`${styles.mlAuto} ${styles.pl3}`}>
          <div className={`${styles.negMx1_5} ${styles.negMy1_5}`}> 
            <button
              type="button"
              onClick={onClose}
              className={styles.dismissBtn}
            >
              <span className={styles.srOnly}>Dismiss</span>
              <svg
                className={styles.iconBtn}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
