/**
 * ImageCapture.jsx
 * Component for capturing and managing up to 4 asset images
 * 
 * Features:
 * - Camera access via getUserMedia
 * - Image preview with thumbnails
 * - Capture, retake, and remove functionality
 * - Image compression for efficient storage
 * - Suggested image types guidance
 */

import React, { useRef, useState } from 'react';
import './ImageCapture.css';

const IMAGE_TYPES = [
  { id: 1, label: 'Front View', icon: '🎯' },
  { id: 2, label: 'Serial Plate', icon: '🏷️' },
  { id: 3, label: 'Location Context', icon: '📍' },
  { id: 4, label: 'Additional/Damage', icon: '🔍' }
];

const ImageCapture = ({ images, onImageAdd, onImageRemove, maxImages = 4 }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [currentImageType, setCurrentImageType] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = async (imageType) => {
    setCurrentImageType(imageType);
    setShowCamera(true);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      alert('Unable to access camera. Please check permissions or use file upload.');
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setCurrentImageType(null);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Compress image to reduce size
    canvas.toBlob(
      (blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          onImageAdd(reader.result);
          stopCamera();
        };
        reader.readAsDataURL(blob);
      },
      'image/jpeg',
      0.8 // 80% quality
    );
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageAdd(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    e.target.value = '';
  };

  const getImageSlotLabel = (index) => {
    return IMAGE_TYPES[index]?.label || `Image ${index + 1}`;
  };

  const getImageSlotIcon = (index) => {
    return IMAGE_TYPES[index]?.icon || '📷';
  };

  return (
    <div className="image-capture-container">
      <div className="image-grid">
        {Array.from({ length: maxImages }).map((_, index) => {
          const image = images[index];
          const isEmpty = !image;
          const slotLabel = getImageSlotLabel(index);
          const slotIcon = getImageSlotIcon(index);

          return (
            <div key={index} className={`image-slot ${isEmpty ? 'empty' : 'filled'}`}>
              {isEmpty ? (
                <div className="empty-slot">
                  <div className="slot-icon">{slotIcon}</div>
                  <div className="slot-label">{slotLabel}</div>
                  <div className="slot-actions">
                    <button
                      type="button"
                      className="capture-button"
                      onClick={() => startCamera(IMAGE_TYPES[index])}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm8-1h-2.6L16 4h-2l-2 2H8L6 4H4L3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-8 12c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"/>
                      </svg>
                      Camera
                    </button>
                    <button
                      type="button"
                      className="upload-button"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/>
                      </svg>
                      Upload
                    </button>
                  </div>
                </div>
              ) : (
                <div className="filled-slot">
                  <img src={image.data} alt={`Asset ${slotLabel}`} />
                  <div className="image-overlay">
                    <span className="image-label">{slotLabel}</span>
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => onImageRemove(image.id)}
                      title="Remove image"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M16 6v12H4V6h12m-1-2H5l-1 1v12l1 1h10l1-1V5l-1-1zm-6 3h2v8h-2V7z"/>
                        <path d="M8 7h2v8H8V7z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* Camera Modal */}
      {showCamera && (
        <div className="camera-modal-overlay">
          <div className="camera-modal">
            <div className="camera-header">
              <h3>
                {currentImageType?.icon} Capture: {currentImageType?.label}
              </h3>
              <button className="close-button" onClick={stopCamera}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.4L17.6 5 12 10.6 6.4 5 5 6.4l5.6 5.6L5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6z"/>
                </svg>
              </button>
            </div>

            <div className="camera-preview-container">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video"
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              <div className="camera-controls">
                <button
                  type="button"
                  className="capture-photo-button"
                  onClick={captureImage}
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                    <circle cx="16" cy="16" r="14" stroke="white" strokeWidth="3" fill="none"/>
                    <circle cx="16" cy="16" r="10" fill="white"/>
                  </svg>
                </button>
              </div>

              <div className="camera-guide">
                <div className="guide-text">
                  {currentImageType?.id === 1 && '📸 Capture clear front view of the asset'}
                  {currentImageType?.id === 2 && '🏷️ Focus on serial number plate'}
                  {currentImageType?.id === 3 && '📍 Show asset in its location context'}
                  {currentImageType?.id === 4 && '🔍 Document any damage or special features'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="image-info-banner">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zm0-6H7V4h2v2z"/>
        </svg>
        <span>
          Capture up to {maxImages} images • Max 5MB per image • 
          JPEG/PNG formats supported
        </span>
      </div>
    </div>
  );
};

export default ImageCapture;
