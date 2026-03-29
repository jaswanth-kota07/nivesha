import React, { useEffect, useState } from 'react';
import styles from './SplashScreen.module.css';
import BrandLogo from './BrandLogo';

const SplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Wait for the main zoom animation to largely finish before fading background
    const timer1 = setTimeout(() => {
      setIsVisible(false);
    }, 2200);

    // Call onComplete when fully faded out to unmount
    const timer2 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className={`${styles.splashContainer} ${!isVisible ? styles.hidden : ''}`}>
      <div className={styles.logoContainer}>
        <BrandLogo size="large" />
      </div>
    </div>
  );
};

export default SplashScreen;
