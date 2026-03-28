import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Calendar, Clock } from 'lucide-react';
import styles from './MyBookings.module.css';

const MyBookings = () => {
    const { myBookings } = useAppContext();

    return (
        <div className={`container ${styles.bookingsContainer}`}>
            <h1 className={styles.title}>My Bookings</h1>

            {myBookings.length === 0 ? (
                <div className={styles.emptyState}>
                    <Calendar size={48} className={styles.emptyIcon} />
                    <h2>No bookings yet</h2>
                    <p>When you book a space, it will appear here.</p>
                </div>
            ) : (
                <div className={styles.bookingsGrid}>
                    {myBookings.map(booking => (
                        <div key={booking.id} className={styles.bookingCard}>
                            <div className={styles.bookingHeader}>
                                <h3>{booking.spaceTitle}</h3>
                                <span className={styles.amount}>₹{booking.totalAmount}</span>
                            </div>
                            <div className={styles.bookingDetails}>
                                <p><Calendar size={16} /> Date: <strong>{booking.date}</strong></p>
                                <p><Clock size={16} /> Time Slots: <strong>{booking.slots.join(', ')}</strong></p>
                                <p className={styles.bookingId}>Booking Ref: {booking.id}</p>
                                <p className={styles.timestamp}>Booked on: {new Date(booking.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
