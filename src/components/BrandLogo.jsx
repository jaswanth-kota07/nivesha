import React from 'react';
import styles from './BrandLogo.module.css';

const BrandLogo = ({ size = 'normal', className = '' }) => {
    return (
        <div className={`${styles.logoLockup} ${size === 'large' ? styles.large : ''} ${className}`}>
            <div className={styles.topRow}>
                <div className={styles.iconWrapper}>
                    <svg viewBox="0 0 100 100" className={styles.svgIcon}>
                        {/* Abstract twisted infinity / leaf pattern mimicking the image */}
                        <g stroke="var(--primary)" strokeWidth="3" fill="none">
                            <path d="M 20 80 Q 40 20, 80 20" />
                            <path d="M 20 80 Q 60 80, 80 20" />
                            <path d="M 20 80 Q 50 50, 80 20" />
                            <path d="M 25 75 Q 50 55, 75 25" />
                        </g>
                        <circle cx="20" cy="80" r="12" fill="var(--primary)" />
                        <circle cx="80" cy="20" r="12" fill="var(--primary)" />
                        <circle cx="20" cy="50" r="8" fill="var(--primary)" />
                    </svg>
                </div>
                <div className={styles.brandName}>
                    n<span className={styles.greenI}>i</span>vesha
                </div>
            </div>
            <div className={styles.tagline}>
                Find Your Space
            </div>
        </div>
    );
};

export default BrandLogo;
