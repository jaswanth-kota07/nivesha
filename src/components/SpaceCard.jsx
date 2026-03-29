import React from 'react';
import { MapPin, Wifi, Accessibility, ArrowRight } from 'lucide-react';
import BookingModal from './BookingModal';
import styles from './SpaceCard.module.css';

const SpaceCard = ({ space }) => {
    const [isBooking, setIsBooking] = React.useState(false);

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <img src={space.image} alt={space.title} className={styles.image} />
                <button className={styles.heartBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{space.title}</h3>
                    <p className={styles.price}>₹{space.price.toLocaleString()}</p>
                </div>

                <div className={styles.location}>
                    <MapPin size={16} />
                    <span>{space.location}</span>
                </div>

                <div className={styles.amenities}>
                    {space.amenities?.map((amenity, index) => (
                        <span key={index} className={styles.amenity}>
                            {amenity === 'WiFi' && <Wifi size={14} />}
                            {amenity === 'Accessibility' && <Accessibility size={14} />}
                            {amenity}
                        </span>
                    ))}
                </div>

                <div className={styles.footer}>
                    <button onClick={() => setIsBooking(true)} className={`btn btn-primary ${styles.bookBtn}`}>
                        Book Now
                    </button>
                </div>
            </div>
            {isBooking && <BookingModal space={space} onClose={() => setIsBooking(false)} />}
        </div>
    );
};

export default SpaceCard;
