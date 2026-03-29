import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, PlusSquare, Wallet, Menu, X, Calendar } from 'lucide-react';
import { useState } from 'react';
import styles from './Navbar.module.css';
import BrandLogo from './BrandLogo';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: 'Home', path: '/', icon: <Home size={20} /> },
        { name: 'Explore', path: '/explore', icon: <Compass size={20} /> },
        { name: 'My Bookings', path: '/bookings', icon: <Calendar size={20} /> },
        { name: 'List Space', path: '/list', icon: <PlusSquare size={20} /> },
        { name: 'Earnings', path: '/earnings', icon: <Wallet size={20} /> },
    ];

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navContainer}`}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <BrandLogo size="normal" />
                </Link>

                {/* Desktop Menu */}
                <div className={styles.navLinks}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`${styles.navItem} ${location.pathname === link.path ? styles.active : ''
                                }`}
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </Link>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button className={styles.mobileMenuBtn} onClick={toggleMenu}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className={styles.mobileMenu}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`${styles.mobileNavItem} ${location.pathname === link.path ? styles.activeMobile : ''
                                }`}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
