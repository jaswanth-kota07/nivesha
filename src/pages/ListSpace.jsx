import React, { useState, useEffect } from 'react';
import { categories } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import { UploadCloud, MapPin, IndianRupee, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import styles from './ListSpace.module.css';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Function to reverse geocode using Nominatim API (OpenStreetMap)
const reverseGeocode = async (lat, lng, setAddress) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
        const data = await response.json();
        if (data && data.display_name) {
            const addr = data.address;
            const simplified = [addr.neighbourhood, addr.suburb, addr.city || addr.town || addr.village, addr.state].filter(Boolean).join(', ');
            setAddress(simplified || data.display_name);
        }
    } catch (error) {
        console.error("Error reverse geocoding:", error);
    }
};

function MapLocationPicker({ position, setPosition, setAddress }) {
    const map = useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            reverseGeocode(lat, lng, setAddress);
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, 15);
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

const ListSpace = () => {
    const { simulateListing } = useAppContext();

    const [formData, setFormData] = useState({
        title: '',
        type: 'terrace',
        location: '',
        price: '',
        description: '',
        image: null
    });
    const [mapPosition, setMapPosition] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData(prev => ({ ...prev, image: file }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUseMyLocation = (e) => {
        e.preventDefault();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setMapPosition([latitude, longitude]);
                    reverseGeocode(latitude, longitude, (address) => {
                        setFormData(prev => ({ ...prev, location: address }));
                    });
                },
                (error) => {
                    console.error("Error getting location", error);
                    alert("Could not get your location.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        simulateListing({
            ...formData,
            lat: mapPosition ? mapPosition[0] : null,
            lng: mapPosition ? mapPosition[1] : null,
            price: Number(formData.price) || 0
        });
        setIsSubmitted(true);

        // Reset form after short delay
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
                title: '',
                type: 'terrace',
                location: '',
                price: '',
                description: '',
                image: null
            });
            setImagePreview(null);
            setMapPosition(null);
        }, 3000);
    };

    return (
        <div className={`container ${styles.container}`}>
            <div className={styles.header}>
                <h1 className={styles.title}>List Your Idle Space</h1>
                <p className={styles.subtitle}>Turn your empty area into extra income. It takes just 2 minutes to get started.</p>
            </div>

            <div className={styles.content}>
                <form className={styles.formContainer} onSubmit={handleSubmit}>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Space Title</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. Beautiful Rooftop Terrace in Bandra"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Space Type</label>
                            <select
                                className={styles.select}
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup} style={{ flex: 1 }}>
                            <label className={styles.label}>Location</label>
                            <div className={styles.inputWrapper} style={{ display: 'flex', gap: '8px' }}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <MapPin size={18} className={styles.inputIcon} />
                                    <input
                                        type="text"
                                        className={`${styles.input} ${styles.inputWithIcon}`}
                                        placeholder="City, Neighborhood or Pick on map"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        required
                                    />
                                </div>
                                <button
                                    className="btn btn-outline"
                                    onClick={handleUseMyLocation}
                                    title="Use Current Location"
                                    type="button"
                                    style={{ padding: '0 12px' }}
                                >
                                    <Navigation size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Price per day</label>
                        <div className={styles.inputWrapper}>
                            <IndianRupee size={18} className={styles.inputIcon} />
                            <input
                                type="number"
                                className={`${styles.input} ${styles.inputWithIcon}`}
                                placeholder="1000"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Pick on Map (Optional)</label>
                        <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', zIndex: 1, position: 'relative' }}>
                            <MapContainer
                                center={mapPosition || [19.0760, 72.8777]}
                                zoom={mapPosition ? 15 : 11}
                                style={{ height: '100%', width: '100%', zIndex: 1 }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <MapLocationPicker
                                    position={mapPosition}
                                    setPosition={setMapPosition}
                                    setAddress={(addr) => setFormData(prev => ({ ...prev, location: addr }))}
                                />
                            </MapContainer>
                        </div>
                        <p className={styles.uploadHint} style={{ marginTop: '4px' }}>Click anywhere on the map to set the location automatically.</p>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            className={styles.textarea}
                            placeholder="Tell guests what makes your space unique..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows="4"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Cover Image</label>
                        <label className={styles.uploadArea} style={{ display: 'block', cursor: 'pointer', position: 'relative', overflow: 'hidden', padding: imagePreview ? '0' : '' }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }} />
                            ) : (
                                <div>
                                    <UploadCloud size={40} className={styles.uploadIcon} style={{ margin: '0 auto 10px' }} />
                                    <p className={styles.uploadText}>Click to upload or drag and drop</p>
                                    <p className={styles.uploadHint}>SVG, PNG, JPG or GIF (max. 5MB)</p>
                                </div>
                            )}
                        </label>
                    </div>

                    <button
                        type="submit"
                        className={`btn btn-primary ${styles.submitBtn}`}
                        disabled={isSubmitted}
                    >
                        {isSubmitted ? 'Listed Successfully!' : 'Save and Publish'}
                    </button>
                </form>

                <div className={styles.sidebar}>
                    <div className={styles.infoCard}>
                        <h3>Why list with Nivesha?</h3>
                        <ul className={styles.featuresList}>
                            <li><strong>Zero upfront fees:</strong> You only pay a small commission when you get a booking.</li>
                            <li><strong>Full control:</strong> Set your own rules, availability, and prices.</li>
                            <li><strong>Host guarantee:</strong> We provide up to ₹1,000,000 in property damage protection.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListSpace;
