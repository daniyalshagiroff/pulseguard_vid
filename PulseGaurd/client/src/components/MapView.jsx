// client/src/components/MapView.jsx
import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons so they work with bundler
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

// Pulsing red dot icon for live alerts
const pulseIcon = L.divIcon({
  className: 'map-pulse-icon',
  html: '<div class="map-pulse-dot"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export default function MapView({ alerts }) {
  const alertsWithLocation = (alerts || []).filter(
    a =>
      a.location &&
      typeof a.location.lat === 'number' &&
      typeof a.location.lng === 'number'
  );

  // Center: average of all alert locations, or Dubai
  const center = useMemo(() => {
    if (!alertsWithLocation.length) return [25.2048, 55.2708];
    const sum = alertsWithLocation.reduce(
      (acc, a) => {
        acc.lat += a.location.lat;
        acc.lng += a.location.lng;
        return acc;
      },
      { lat: 0, lng: 0 }
    );
    return [sum.lat / alertsWithLocation.length, sum.lng / alertsWithLocation.length];
  }, [alertsWithLocation]);

  return (
    <div className="map-view">
      <div className="map-view-header">
        <h3>Live Map</h3>
        <div className="map-live-badge">
          <span className="map-live-badge-dot" />
          <span>Live</span>
        </div>
      </div>

      <div className="map-view-body">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={false}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {alertsWithLocation.map(alert => (
            <Marker
              key={alert.id}
              position={[alert.location.lat, alert.location.lng]}
              icon={pulseIcon}
            >
              <Popup>
                <div style={{ fontSize: 13 }}>
                  <div>
                    <strong>{alert.id}</strong>
                  </div>
                  <div>Type: {alert.type}</div>
                  <div>Weapon: {alert.weapon || 'unknown'}</div>
                  <div>Conf: {(alert.confidence || 0).toFixed(2)}</div>
                  <div>Camera: {alert.cameraId || 'N/A'}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

    </div>
  );
}

