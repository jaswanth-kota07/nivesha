import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [earnings, setEarnings] = useState(() => {
        const saved = localStorage.getItem('nivesha_earnings');
        if (saved) return Number(saved);
        localStorage.setItem('nivesha_earnings', '1200');
        return 1200;
    });
    const [notifications, setNotifications] = useState([]);
    const [mySpaces, setMySpaces] = useState(() => {
        const saved = localStorage.getItem('nivesha_spaces');
        return saved ? JSON.parse(saved) : [];
    });
    const [myBookings, setMyBookings] = useState(() => {
        const saved = localStorage.getItem('nivesha_bookings');
        return saved ? JSON.parse(saved) : [];
    });

    const addNotification = (message, type = 'success') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    const simulateBooking = (price) => {
        // Kept for backward compatibility with old explore page until it is updated
        const newEarnings = earnings + price;
        setEarnings(newEarnings);
        localStorage.setItem('nivesha_earnings', newEarnings.toString());
        addNotification(`Booking simulated! ₹${price} added to earnings.`);
    };

    const simulateListing = (spaceData) => {
        const title = spaceData.title || 'Your Space';
        const newSpace = {
            ...spaceData,
            id: `usr_${Date.now()}`,
            timestamp: new Date().toISOString(),
            isUserCreated: true
        };
        // Clean out File objects so it can be JSON stringified safely
        if (newSpace.image && typeof newSpace.image !== 'string') {
            newSpace.image = URL.createObjectURL(newSpace.image); // Create a temporary blob URL for UI
        }

        const updatedSpaces = [...mySpaces, newSpace];
        setMySpaces(updatedSpaces);
        localStorage.setItem('nivesha_spaces', JSON.stringify(updatedSpaces));
        addNotification(`Your space "${title}" has been successfully listed!`);
    };

    const bookSpace = (space, bookingDetails) => {
        const newBooking = {
            id: `bkg_${Date.now()}`,
            spaceId: space.id,
            spaceTitle: space.title,
            ...bookingDetails,
            timestamp: new Date().toISOString()
        };
        const updatedBookings = [...myBookings, newBooking];
        setMyBookings(updatedBookings);
        localStorage.setItem('nivesha_bookings', JSON.stringify(updatedBookings));

        const newEarnings = earnings + bookingDetails.totalAmount;
        setEarnings(newEarnings);
        localStorage.setItem('nivesha_earnings', newEarnings.toString());
        addNotification(`Booking confirmed! ₹${bookingDetails.totalAmount} added to earnings.`);
    };

    return (
        <AppContext.Provider value={{
            earnings,
            notifications,
            mySpaces,
            myBookings,
            simulateBooking,
            simulateListing,
            bookSpace,
            addNotification
        }}>
            {children}

            {/* Global Notifications */}
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                {notifications.map(n => (
                    <div key={n.id} style={{
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        boxShadow: 'var(--shadow-lg)',
                        animation: 'slideIn 0.3s ease-out forwards',
                        fontWeight: 500
                    }}>
                        {n.message}
                    </div>
                ))}
            </div>
        </AppContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
