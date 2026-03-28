import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { mockSpaces, categories } from '../data/mockData';
import { Search, Filter, MapPin, Wifi, Accessibility, Map as MapIcon, List as ListIcon, Navigation } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import BookingModal from '../components/BookingModal';
import styles from './Explore.module.css';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function ChangeView({ center, zoom }) {
    const map = useMap();
    if (center) map.setView(center, zoom);
    return null;
}

const Explore = () => {
    const location = useLocation();
    const { simulateBooking, mySpaces = [], bookSpace } = useAppContext();

    const [filterType, setFilterType] = useState(() => {
        const params = new URLSearchParams(location.search);
        return params.get('category') || 'all';
    });
    const [priceRange, setPriceRange] = useState(5000);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('list');
    const [userLocation, setUserLocation] = useState(null);
    const [selectedSpace, setSelectedSpace] = useState(null);

    const handleUseMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                    setViewMode('map');
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



    const allSpaces = [...mySpaces, ...mockSpaces];

    const filteredSpaces = allSpaces.filter(space => {
        // Type Filter
        if (filterType !== 'all' && space.type !== filterType) return false;

        // Price Filter
        if (space.price > priceRange) return false;

        // Search Query (Location, Title, or Type)
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            if (
                !space.title.toLowerCase().includes(q) &&
                !space.location.toLowerCase().includes(q) &&
                !space.type.toLowerCase().includes(q)
            ) {
                return false;
            }
        }

        return true;
    });

    const handleBook = (e, space) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedSpace(space);
    };

    return (
        <div className={`container ${styles.exploreContainer}`}>

            {/* Sidebar Filters */}
            <aside className={styles.sidebar}>
                <div className={styles.filterSection}>
                    <div className={styles.searchBox}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search by location, name or type..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                <div className={styles.filterSection}>
                    <h3 className={styles.filterTitle}>Space Type</h3>
                    <select
                        className={styles.select}
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.filterSection}>
                    <div className={styles.filterHeader}>
                        <h3 className={styles.filterTitle}>Max Price</h3>
                        <span className={styles.priceValue}>₹{priceRange}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="10000"
                        step="500"
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className={styles.rangeSlider}
                    />
                </div>

                <div className={styles.filterSection}>
                    <h3 className={styles.filterTitle}>Amenities (Mock)</h3>
                    <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                            <input type="checkbox" defaultChecked />
                            <Wifi size={16} /> WiFi
                        </label>
                        <label className={styles.checkboxLabel}>
                            <input type="checkbox" defaultChecked />
                            <Accessibility size={16} /> Accessibility
                        </label>
                        <label className={styles.checkboxLabel}>
                            <input type="checkbox" />
                            <span>CCTV</span>
                        </label>
                    </div>
                </div>
            </aside>

            {/* Main Content Grid */}
            <main className={styles.mainContent}>
                <div className={styles.resultsHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 className={styles.resultsTitle}>Explore Spaces</h1>
                        <p className={styles.resultsCount}>{filteredSpaces.length} spots found</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                            className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setViewMode('list')}
                            style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                            <ListIcon size={16} /> List
                        </button>
                        <button
                            className={`btn ${viewMode === 'map' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setViewMode('map')}
                            style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                            <MapIcon size={16} /> Map
                        </button>
                        <button
                            className="btn btn-outline"
                            onClick={handleUseMyLocation}
                            style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center' }}
                            title="Use My Location"
                        >
                            <Navigation size={16} />
                        </button>
                    </div>
                </div>

                {filteredSpaces.length === 0 ? (
                    <div className={styles.noResults}>
                        <Filter size={48} className={styles.noResultsIcon} />
                        <h2>No spaces found </h2>
                        <p>Try adjusting your filters or search query.</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setFilterType('all');
                                setPriceRange(5000);
                                setSearchQuery('');
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : viewMode === 'list' ? (
                    <div className={styles.grid}>
                        {filteredSpaces.map(space => (
                            <div key={space.id} className={styles.card}>
                                <div className={styles.imageContainer}>
                                    <img src={space.image} alt={space.title} className={styles.image} />
                                </div>
                                <div className={styles.content}>
                                    <h3 className={styles.title}>{space.title}</h3>
                                    <p className={styles.price}>₹{space.price.toLocaleString()} <span className={styles.priceUnit}>/ day</span></p>

                                    <div className={styles.location}>
                                        <MapPin size={16} />
                                        <span>{space.location}</span>
                                    </div>

                                    <button
                                        className={`btn btn-primary ${styles.bookBtn}`}
                                        onClick={(e) => handleBook(e, space)}
                                    >
                                        Simulate Booking
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ height: '600px', width: '100%', borderRadius: '12px', overflow: 'hidden', marginTop: '1rem', border: '1px solid var(--border-color)', zIndex: 1, position: 'relative' }}>
                        <MapContainer
                            center={userLocation || (filteredSpaces.length > 0 ? [filteredSpaces[0].lat, filteredSpaces[0].lng] : [19.0760, 72.8777])}
                            zoom={userLocation ? 13 : 11}
                            style={{ height: '100%', width: '100%', zIndex: 1 }}
                        >
                            <ChangeView
                                center={userLocation || (filteredSpaces.length > 0 ? [filteredSpaces[0].lat, filteredSpaces[0].lng] : null)}
                                zoom={userLocation ? 13 : 11}
                            />
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {filteredSpaces.map(space => space.lat && space.lng && (
                                <Marker key={space.id} position={[space.lat, space.lng]}>
                                    <Popup>
                                        <div style={{ width: '200px', padding: '0px' }}>
                                            <img src={space.image} alt={space.title} style={{ width: '200px', height: '120px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px', marginLeft: '-20px', marginTop: '-14px', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }} />
                                            <div style={{ padding: '0 4px' }}>
                                                <h4 style={{ margin: '0 0 4px', fontSize: '14px', lineHeight: '1.2' }}>{space.title}</h4>
                                                <p style={{ margin: '0 0 8px', fontWeight: 'bold', color: 'var(--primary-color)' }}>₹{space.price} / day</p>
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ width: '100%', padding: '0.4rem', fontSize: '12px' }}
                                                    onClick={(e) => handleBook(e, space)}
                                                >
                                                    Simulate Booking
                                                </button>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                            {userLocation && (
                                <Marker position={userLocation}>
                                    <Popup>You are here</Popup>
                                </Marker>
                            )}
                        </MapContainer>
                    </div>
                )}
            </main>

            {selectedSpace && (
                <BookingModal
                    space={selectedSpace}
                    onClose={() => setSelectedSpace(null)}
                />
            )}
        </div>
    );
};

export default Explore;
