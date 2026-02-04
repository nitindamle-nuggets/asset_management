/**
 * LocationTracker.jsx
 * GPS location tracking component with auto-capture and manual refresh
 * 
 * Features:
 * - Automatic location capture on mount
 * - Manual refresh capability
 * - Accuracy indicator
 * - Admin/user permission handling
 * - Fallback messaging for permission issues
 */

import React, { useEffect, useState } from 'react';
import './LocationTracker.css';

const LocationTracker = ({ location, onLocationCapture, userRole }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState(null);
  const [permission, setPermission] = useState('prompt'); // 'granted', 'denied', 'prompt'
  const isAdmin = userRole === 'Admin' || userRole === 'Super Admin';

  useEffect(() => {
    // Auto-capture location on mount
    if (!location) {
      captureLocation();
    }

    // Check location permission status
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermission(result.state);
        result.addEventListener('change', () => {
          setPermission(result.state);
        });
      });
    }
  }, []);

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsCapturing(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        };
        
        onLocationCapture(locationData);
        setIsCapturing(false);
      },
      (err) => {
        console.error('Location error:', err);
        let errorMessage = 'Unable to retrieve location';
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
            setPermission('denied');
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please ensure GPS is enabled.';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = 'An unknown error occurred while fetching location.';
        }
        
        setError(errorMessage);
        setIsCapturing(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const getAccuracyLevel = (accuracy) => {
    if (accuracy < 10) return { level: 'excellent', label: 'Excellent', color: '#10b981' };
    if (accuracy < 50) return { level: 'good', label: 'Good', color: '#3b82f6' };
    if (accuracy < 100) return { level: 'fair', label: 'Fair', color: '#f59e0b' };
    return { level: 'poor', label: 'Poor', color: '#ef4444' };
  };

  const formatCoordinate = (value, type) => {
    if (!value) return 'N/A';
    const direction = type === 'lat' 
      ? (value >= 0 ? 'N' : 'S')
      : (value >= 0 ? 'E' : 'W');
    return `${Math.abs(value).toFixed(6)}° ${direction}`;
  };

  const openInMaps = () => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="location-tracker-container">
      {location ? (
        <div className="location-display">
          <div className="location-header">
            <div className="location-status">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="location-icon">
                <path d="M10 0C6.7 0 4 2.7 4 6c0 4.5 6 14 6 14s6-9.5 6-14c0-3.3-2.7-6-6-6zm0 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
              </svg>
              <span className="status-text">Location Captured</span>
              {(() => {
                const accuracyInfo = getAccuracyLevel(location.accuracy);
                return (
                  <span 
                    className="accuracy-badge"
                    style={{ 
                      backgroundColor: accuracyInfo.color + '20',
                      color: accuracyInfo.color,
                      border: `1px solid ${accuracyInfo.color}`
                    }}
                  >
                    {accuracyInfo.label}
                  </span>
                );
              })()}
            </div>

            <div className="location-actions">
              <button
                type="button"
                className="refresh-button"
                onClick={captureLocation}
                disabled={isCapturing || !isAdmin}
                title={isAdmin ? 'Refresh location' : 'Admin only'}
              >
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 18 18" 
                  fill="currentColor"
                  className={isCapturing ? 'spinning' : ''}
                >
                  <path d="M9 3V0l4 4-4 4V5c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6h2c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8z"/>
                </svg>
              </button>

              <button
                type="button"
                className="map-button"
                onClick={openInMaps}
                title="View in Google Maps"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                  <path d="M16 0H2C.9 0 0 .9 0 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zm-3.5 14L9 11.5 5.5 14l1-4.5L3 6.5l4.5-.5L9 2l1.5 4 4.5.5-3.5 3 1 4.5z"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="coordinates-grid">
            <div className="coordinate-item">
              <label>Latitude</label>
              <div className="coordinate-value">
                {formatCoordinate(location.latitude, 'lat')}
              </div>
            </div>

            <div className="coordinate-item">
              <label>Longitude</label>
              <div className="coordinate-value">
                {formatCoordinate(location.longitude, 'lng')}
              </div>
            </div>

            <div className="coordinate-item">
              <label>Accuracy</label>
              <div className="coordinate-value">
                ±{location.accuracy.toFixed(1)} meters
              </div>
            </div>

            <div className="coordinate-item">
              <label>Timestamp</label>
              <div className="coordinate-value timestamp">
                {new Date(location.timestamp).toLocaleString('en-IN', {
                  dateStyle: 'short',
                  timeStyle: 'short'
                })}
              </div>
            </div>
          </div>

          {!isAdmin && (
            <div className="read-only-notice">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <path d="M7 0C3.1 0 0 3.1 0 7s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 11c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H6V3h2v5z"/>
              </svg>
              Location data is read-only for your role
            </div>
          )}
        </div>
      ) : (
        <div className="location-capture">
          {error ? (
            <div className="location-error">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor" className="error-icon">
                <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm2 30h-4v-4h4v4zm0-8h-4V14h4v12z"/>
              </svg>
              <p className="error-message">{error}</p>
              
              {permission === 'denied' && (
                <div className="permission-help">
                  <p><strong>To enable location access:</strong></p>
                  <ol>
                    <li>Click the lock icon in your browser's address bar</li>
                    <li>Set "Location" permission to "Allow"</li>
                    <li>Refresh the page</li>
                  </ol>
                </div>
              )}

              <button
                type="button"
                className="retry-button"
                onClick={captureLocation}
                disabled={isCapturing}
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="capturing-state">
              <div className="pulse-animation">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor">
                  <path d="M24 4C17.4 4 12 9.4 12 16c0 10.5 12 28 12 28s12-17.5 12-28c0-6.6-5.4-12-12-12zm0 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
                </svg>
              </div>
              <p className="capturing-text">
                {isCapturing ? 'Capturing location...' : 'Initializing GPS...'}
              </p>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="location-info">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <path d="M7 0C3.1 0 0 3.1 0 7s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm.7 11H6.3V6.3h1.4V11zm0-5.6H6.3V4h1.4v1.4z"/>
        </svg>
        <span>
          Location is auto-captured for audit compliance. 
          {isAdmin ? ' Admins can manually refresh if needed.' : ' Contact admin to update.'}
        </span>
      </div>
    </div>
  );
};

export default LocationTracker;
