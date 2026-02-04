/**
 * BarcodeScanner.jsx
 * Camera-based barcode/QR code scanner component
 * 
 * Uses Web APIs:
 * - getUserMedia for camera access
 * - BarcodeDetector API (with fallback to manual entry)
 * 
 * Features:
 * - Real-time camera preview
 * - Auto-detection of barcodes
 * - Manual entry fallback
 * - Multiple format support
 */

import React, { useEffect, useRef, useState } from 'react';
import './BarcodeScanner.css';

const BarcodeScanner = ({ onScan, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [detectorAvailable, setDetectorAvailable] = useState(false);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  useEffect(() => {
    // Check if BarcodeDetector is available
    if ('BarcodeDetector' in window) {
      setDetectorAvailable(true);
      initializeCamera();
    } else {
      setError('Barcode detection not supported. Please enter manually.');
      setManualMode(true);
    }

    return () => {
      cleanup();
    };
  }, []);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
        startScanning();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera access denied. Please check permissions or enter barcode manually.');
      setManualMode(true);
    }
  };

  const startScanning = async () => {
    if (!('BarcodeDetector' in window)) return;

    try {
      const barcodeDetector = new window.BarcodeDetector({
        formats: [
          'qr_code',
          'ean_13',
          'ean_8',
          'code_128',
          'code_39',
          'code_93',
          'codabar',
          'upc_a',
          'upc_e'
        ]
      });

      scanIntervalRef.current = setInterval(async () => {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          
          context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

          try {
            const barcodes = await barcodeDetector.detect(canvas);
            
            if (barcodes.length > 0) {
              const barcode = barcodes[0];
              onScan(barcode.rawValue);
              cleanup();
            }
          } catch (err) {
            console.error('Barcode detection error:', err);
          }
        }
      }, 500); // Scan every 500ms
    } catch (err) {
      console.error('BarcodeDetector initialization error:', err);
      setError('Scanner initialization failed. Please enter manually.');
      setManualMode(true);
    }
  };

  const cleanup = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsScanning(false);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScan(manualInput.trim());
    }
  };

  const switchToManual = () => {
    cleanup();
    setManualMode(true);
  };

  return (
    <div className="barcode-scanner-overlay">
      <div className="barcode-scanner-modal">
        <div className="scanner-header">
          <h3>Scan Barcode / QR Code</h3>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.4L17.6 5 12 10.6 6.4 5 5 6.4l5.6 5.6L5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6z"/>
            </svg>
          </button>
        </div>

        <div className="scanner-content">
          {!manualMode && !error && (
            <div className="camera-container">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-preview"
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              
              <div className="scanner-overlay">
                <div className="scan-frame">
                  <div className="corner corner-tl"></div>
                  <div className="corner corner-tr"></div>
                  <div className="corner corner-bl"></div>
                  <div className="corner corner-br"></div>
                </div>
                <p className="scan-instruction">
                  {isScanning ? 'Position barcode within frame' : 'Initializing camera...'}
                </p>
              </div>

              <button className="manual-toggle-button" onClick={switchToManual}>
                Enter Manually
              </button>
            </div>
          )}

          {(manualMode || error) && (
            <div className="manual-entry">
              {error && (
                <div className="error-message">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"/>
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleManualSubmit}>
                <label>Enter Barcode / QR Code</label>
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Enter barcode value"
                  autoFocus
                />
                <div className="manual-actions">
                  {detectorAvailable && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setManualMode(false);
                        setError(null);
                        setManualInput('');
                        initializeCamera();
                      }}
                    >
                      Use Camera
                    </button>
                  )}
                  <button type="submit" className="btn-primary" disabled={!manualInput.trim()}>
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="scanner-footer">
          <div className="supported-formats">
            <small>Supported: QR Code, EAN, UPC, Code 128, Code 39</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
