import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { categories, mockSpaces, ideasToIdle } from '../data/mockData';
import SpaceCard from '../components/SpaceCard';
import { useAppContext } from '../context/AppContext';
import styles from './Home.module.css';

const Home = () => {
    const { mySpaces = [] } = useAppContext();
    const featuredSpaces = mockSpaces.filter(space => space.featured);
    const latestListings = [...mySpaces, ...featuredSpaces].slice(0, 6);

    // Helper to render lucide-react icons dynamically
    const renderIcon = (iconName) => {
        const Icon = Icons[iconName];
        return Icon ? <Icon size={32} /> : null;
    };

    return (
        <div className={styles.homeContainer}>
            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className="container">
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>
                            Unlock the Potential<br />of Idle Spaces.
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Find or list playgrounds, parking lots, terraces, and rooms for short-term use.
                        </p>
                        <Link to="/explore" className="btn btn-primary">
                            Find Your Space Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Space Types */}
            <section className={styles.section}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Featured Space Types</h2>
                    <div className={styles.categoriesGrid}>
                        {categories.map(category => (
                            <Link to={`/explore?category=${category.id}`} key={category.id} className={styles.categoryCard}>
                                <div className={styles.iconWrapper}>
                                    {renderIcon(category.icon)}
                                </div>
                                <h3 className={styles.categoryName}>{category.name}</h3>
                                <p className={styles.categorySubtitle}>{category.subtitle}</p>
                                <span className={styles.bookLink}>Book Now</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest Listings */}
            <section className={`${styles.section} ${styles.bgDarker}`}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Latest Listings</h2>
                        <Link to="/explore" className={styles.exploreLink}>Explore All Listings</Link>
                    </div>
                    <div className={styles.spacesGrid}>
                        {latestListings.map(space => (
                            <SpaceCard key={space.id} space={space} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Ideas to Idle */}
            <section className={styles.section}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Ideas to Idle</h2>
                    <div className={styles.ideasGrid}>
                        {ideasToIdle.map(idea => (
                            <div key={idea.id} className={styles.ideaCard}>
                                <img src={idea.image} alt={idea.title} className={styles.ideaImage} />
                                <div className={styles.ideaContent}>
                                    <h3 className={styles.ideaTitle}>{idea.title}</h3>
                                    <p className={styles.ideaDescription}>{idea.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
