import React, { useState } from 'react';
import { X, Calendar, Clock, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import styles from './BookingModal.module.css';

const BookingModal = ({ space, onClose }) => {
    const { bookSpace } = useAppContext();
    const [date, setDate] = useState('');
    const [slots, setSlots] = useState([]);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const availableSlots = ['09:00 - 12:00', '12:00 - 15:00', '15:00 - 18:00', '18:00 - 21:00'];

    const handleSlotToggle = (slot) => {
        setSlots(prev => prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]);
    };

    const totalAmount = space ? (space.price * Math.max(1, slots.length)) : 0; // Assuming price is per slot for simplicity

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!date || slots.length === 0 || !acceptedTerms) return;

        bookSpace(space, {
            date,
            slots,
            totalAmount
        });
        onClose();
    };

    if (!space) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>

                <h2 className={styles.title}>Book {space.title}</h2>
                <div className={styles.spaceDetails}>
                    <img src={space.image} alt={space.title} className={styles.spaceImage} />
                    <div className={styles.spaceInfo}>
                        <p className={styles.location}>{space.location}</p>
                        <p className={styles.price}>₹{space.price} <span>/ slot</span></p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}><Calendar size={16} /> Select Date</label>
                        <input
                            type="date"
                            className={styles.input}
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}><Clock size={16} /> Select Time Slots</label>
                        <div className={styles.slotsGrid}>
                            {availableSlots.map(slot => (
                                <button
                                    key={slot}
                                    type="button"
                                    className={`${styles.slotBtn} ${slots.includes(slot) ? styles.slotActive : ''}`}
                                    onClick={() => handleSlotToggle(slot)}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                        {slots.length === 0 && <p className={styles.hintText}>Please select at least one time slot.</p>}
                    </div>

                    <div className={styles.summaryBox}>
                        <div className={styles.summaryRow}>
                            <span>Base Price</span>
                            <span>₹{space.price}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Slots Selected</span>
                            <span>x {Math.max(1, slots.length)}</span>
                        </div>
                        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                            <span>Total Amount</span>
                            <span>₹{totalAmount}</span>
                        </div>
                    </div>

                    <div className={styles.termsGroup}>
                        <label className={styles.termsLabel}>
                            <input
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={e => setAcceptedTerms(e.target.checked)}
                                required
                            />
                            <span>I agree to the <a href="#" onClick={e => e.preventDefault()}>Terms and Conditions</a> and facility rules.</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className={`btn btn-primary ${styles.submitBtn}`}
                        disabled={!date || slots.length === 0 || !acceptedTerms}
                    >
                        <ShieldCheck size={18} /> Confirm Booking (Pay ₹{totalAmount})
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
