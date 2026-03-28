import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerContent}>
                    <div className={styles.brand}>
                        <Link to="/" className={styles.logo}>
                            <span className={styles.niveshaText}>
                                n<span className={styles.primaryText}>i</span>vesha
                            </span>
                        </Link>
                        <p className={styles.tagline}>Find Your Space</p>
                    </div>

                    <div className={styles.links}>
                        <Link to="/list" className={styles.link}>Nivesha</Link>
                        <Link to="#" className={styles.link}>Privacy</Link>
                        <Link to="#" className={styles.link}>Terms</Link>
                        <Link to="#" className={styles.link}>Career</Link>
                        <Link to="/list" className={styles.link}>Partner with Us</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
