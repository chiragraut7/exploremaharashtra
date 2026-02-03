'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import 'leaflet/dist/leaflet.css' // Import Leaflet CSS

// Icon mapping
const CATEGORY_ICONS: Record<string, string> = {
  all: 'fa-layer-group',
  beaches: 'fa-water',
  hills: 'fa-cloud-sun',
  forts: 'fa-chess-rook',
  nature: 'fa-leaf',
  religious: 'fa-om'
};

const InteractiveMap = () => {
  const [locations, setLocations] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [MapComponents, setMapComponents] = useState<any>(null)

  useEffect(() => {
    // 1. Fetch Data
    fetch('/api/locations')
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch(err => console.error("Map data error:", err));

    // 2. Initialize Leaflet (Client-side only)
    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        const { MapContainer, TileLayer, Marker, Popup, ZoomControl } = await import('react-leaflet');
        
        // --- NEW: Import Cluster Library ---
        const MarkerClusterGroup = (await import('react-leaflet-cluster')).default;

        // Custom "Ripple" Marker with DYNAMIC ICON
        const createIcon = (color: string, category: string) => {
            const iconClass = CATEGORY_ICONS[category] || 'fa-map-marker-alt';
            
            return new L.DivIcon({
              html: `
                <div class="marker-container">
                   <div class="pin-head" style="background-color: ${color}; box-shadow: 0 2px 8px ${color}40;">
                      <i class="fas ${iconClass}"></i>
                   </div>
                   <div class="pin-pulse" style="background-color: ${color}"></div>
                </div>
              `,
              className: 'custom-leaflet-icon',
              iconSize: [32, 32], 
              iconAnchor: [16, 32], 
              popupAnchor: [0, -36] 
            });
        };

        // --- NEW: Custom Cluster Bubble Icon ---
        const createClusterCustomIcon = function (cluster: any) {
          return new L.DivIcon({
            html: `<span class="cluster-pill">${cluster.getChildCount()}</span>`,
            className: 'custom-marker-cluster',
            iconSize: [40, 40]
          });
        };

        setMapComponents({ 
            MapContainer, TileLayer, Marker, Popup, ZoomControl, 
            MarkerClusterGroup, createIcon, createClusterCustomIcon // Export new components
        });
      } catch (error) {
        console.error("Leaflet failed to load:", error);
      }
    };

    initMap();
  }, [])

  const filtered = filter === 'all' ? locations : locations.filter(l => l.category === filter)

  // LOADING STATE
  if (!MapComponents) {
    return (
      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-center bg-white rounded-5 shadow-sm border" style={{ height: '600px' }}>
           <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status"></div>
              <p className="small fw-bold letter-spacing-2 text-muted text-uppercase">Loading Atlas...</p>
           </div>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, ZoomControl, MarkerClusterGroup, createIcon, createClusterCustomIcon } = MapComponents;

  return (
    <div className="position-relative map-widget-container">
      
      {/* --- MAP CANVAS --- */}
      <div className="map-frame rounded-5 overflow-hidden shadow-xl border bg-white position-relative">
        
        {/* Floating Filter Bar (Inside Map) */}
        <div className="map-overlay-controls">
            <div className="glass-filter-bar">
                {['all', 'beaches', 'hills', 'forts', 'nature', 'religious'].map(cat => (
                    <button 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`glass-pill ${filter === cat ? 'active' : ''}`}
                    title={cat.toUpperCase()}
                    >
                    <i className={`fas ${CATEGORY_ICONS[cat]}`}></i>
                    <span className="d-none d-md-inline ms-2">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                    </button>
                ))}
            </div>
        </div>

        <MapContainer 
            center={[19.0, 74.5]} 
            zoom={6.5} 
            scrollWheelZoom={false}
            zoomControl={false} 
            style={{ height: '600px', width: '100%', zIndex: 1, background: '#eef2f5' }}
        >
          {/* HD Voyager Tiles */}
          <TileLayer 
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap'
          />
          
          <ZoomControl position="bottomright" />

          {/* --- NEW: WRAP MARKERS IN CLUSTER GROUP --- */}
          <MarkerClusterGroup
             chunkedLoading
             iconCreateFunction={createClusterCustomIcon}
             maxClusterRadius={60}
             spiderfyOnMaxZoom={true}
          >
            {filtered.map((loc: any) => (
                loc.coordinates && (
                <Marker 
                    key={loc.id} 
                    position={[loc.coordinates.lat, loc.coordinates.lng]} 
                    // Pass both color and category to createIcon
                    icon={createIcon(loc.color || '#00aaff', loc.category)}
                >
                    <Popup className="premium-glass-popup" closeButton={false} minWidth={280}>
                    <div className="popup-card">
                        {/* Image */}
                        <div className="popup-media">
                            <img 
                                src={loc.image || "/assets/images/map-placeholder.png"} 
                                alt={loc.name} 
                                className="popup-img"
                            />
                            <div className="popup-badge">
                                <i className={`fas ${CATEGORY_ICONS[loc.category] || 'fa-map-pin'} me-1`}></i>
                                {loc.category}
                            </div>
                        </div>
                        
                        {/* Content */}
                        <div className="popup-details">
                        <h5 className="popup-title">{loc.name}</h5>
                        <p className="popup-subtitle">{loc.subtitle || "Discover this location"}</p>
                        
                        <Link href={`/${loc.category}/${loc.id}`} className="popup-action-btn">
                            <span>Explore Guide</span>
                            <div className="btn-icon-circle">
                                <i className="fas fa-arrow-right"></i>
                            </div>
                        </Link>
                        </div>
                    </div>
                    </Popup>
                </Marker>
                )
            ))}
          </MarkerClusterGroup>

        </MapContainer>
        
        {/* Inner Shadow Gradient for Depth */}
        <div className="map-inset-vignette pointer-events-none"></div>
      </div>

      <style jsx global>{`
        /* --- NEW: CLUSTER STYLES --- */
        .custom-marker-cluster {
            background: rgba(255, 87, 34, 0.85); /* Orange Glass */
            border: 2px solid white;
            border-radius: 50%;
            text-align: center;
            color: white;
            font-weight: 800;
            font-size: 14px;
            display: flex !important;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(255, 87, 34, 0.4);
            transition: transform 0.2s ease;
        }
        .custom-marker-cluster:hover {
            transform: scale(1.1);
            background: #ff5722;
            cursor: pointer;
        }
        .cluster-pill { pointer-events: none; }

        /* --- EXISTING STYLES --- */
        .map-widget-container {
            perspective: 1000px;
        }
        .map-frame {
            border: 6px solid #fff;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
            transform-style: preserve-3d;
        }
        
        /* --- FLOATING CONTROLS (Floating Island) --- */
        .map-overlay-controls {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 500; /* Above Map */
            width: 90%;
            max-width: 700px;
            display: flex;
            justify-content: center;
        }

        .glass-filter-bar {
            display: flex;
            gap: 8px;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            padding: 8px;
            border-radius: 100px;
            border: 1px solid rgba(255, 255, 255, 0.6);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow-x: auto;
            scrollbar-width: none; /* Hide scrollbar */
        }

        .glass-pill {
            border: none;
            background: transparent;
            padding: 10px 18px;
            border-radius: 50px;
            color: #555;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
            white-space: nowrap;
            display: flex;
            align-items: center;
        }

        .glass-pill:hover {
            background: rgba(0,0,0,0.05);
            color: #000;
        }

        .glass-pill.active {
            background: #111;
            color: #fff;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transform: scale(1.05);
        }

        /* --- CUSTOM MARKER (SMALLER) --- */
        .custom-leaflet-icon {
            background: transparent;
            border: none;
        }
        .marker-container {
            position: relative;
            width: 32px; height: 32px; /* Reduced container size */
            display: flex; justify-content: center; align-items: center;
        }
        .pin-head {
            width: 26px; height: 26px; /* Reduced pin size */
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex; align-items: center; justify-content: center;
            color: white;
            border: 2px solid white;
            position: relative;
            z-index: 2;
        }
        /* Rotate icon back to upright and scale it down */
        .pin-head i { transform: rotate(45deg); font-size: 10px; }
        
        /* Pulse Effect */
        .pin-pulse {
            position: absolute;
            width: 100%; height: 100%;
            border-radius: 50%;
            opacity: 0;
            z-index: 1;
            animation: ripple 2s infinite;
        }
        @keyframes ripple {
            0% { transform: scale(0.8); opacity: 0.8; }
            100% { transform: scale(1.5); opacity: 0; }
        }

        /* --- POPUP CARD --- */
        .leaflet-popup-content-wrapper {
            padding: 0;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            background: #fff;
        }
        .leaflet-popup-content {
            margin: 0;
            width: 280px !important;
        }
        
        .popup-media { position: relative; height: 160px; overflow: hidden; }
        .popup-img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .popup-card:hover .popup-img { transform: scale(1.1); }
        
        .popup-badge {
            position: absolute; top: 12px; left: 12px;
            background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
            color: #fff; padding: 4px 10px; border-radius: 30px;
            font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
        }

        .popup-details { padding: 18px; text-align: center; }
        .popup-title { font-weight: 800; font-size: 1.1rem; margin-bottom: 4px; color: #222; }
        .popup-subtitle { font-size: 0.8rem; color: #777; margin-bottom: 15px; text-transform: capitalize; }

        .popup-action-btn {
            display: flex; align-items: center; justify-content: space-between;
            background: #f8f9fa; color: #333;
            text-decoration: none; padding: 8px 8px 8px 20px;
            border-radius: 50px; font-weight: 700; font-size: 0.8rem;
            transition: 0.3s; border: 1px solid #eee;
        }
        .popup-action-btn:hover {
            background: #111; color: #fff; border-color: #111;
        }
        .btn-icon-circle {
            width: 32px; height: 32px; background: #fff; border-radius: 50%;
            display: flex; align-items: center; justify-content: center; color: #111;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        /* --- VIGNETTE --- */
        .map-inset-vignette {
            position: absolute; inset: 0;
            box-shadow: inset 0 0 60px rgba(0,0,0,0.08);
            z-index: 400; border-radius: 2rem;
        }
        
        /* Cleanup */
        .leaflet-container { font-family: inherit; }
        .leaflet-popup-tip { display: none; } /* Hide the little triangle for a floating look */
        .leaflet-control-zoom { border: none !important; box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important; margin-bottom: 20px !important; margin-right: 20px !important; }
        .leaflet-control-zoom a { border-radius: 8px !important; color: #333 !important; }
      `}</style>
    </div>
  )
}

export default InteractiveMap;