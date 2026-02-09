/**
 * AssetDataCapture.jsx
 * Main component for Nuggetts EAM Asset Data Input Screen
 * 
 * Features:
 * - Responsive design (mobile-first)
 * - IT/Non-IT asset type switching
 * - Barcode scanning
 * - Image capture (up to 4 images)
 * - GPS location tracking
 * - Offline support with localStorage
 * - Form validation
 * 
 * @author Nuggetts EAM Development Team
 */

import React, { useState, useEffect, useCallback } from 'react';
import BarcodeScanner from './components/BarcodeScanner';
import ImageCapture from './components/ImageCapture';
import LocationTracker from './components/LocationTracker';
import { mockData } from './data/mockData';
import './styles/AssetDataCapture.css';

const AssetDataCapture = () => {
  // User context
  const [userContext] = useState({
    userName: 'John Smith',
    role: 'Field Technician',
    locationName: 'Warehouse A - North Wing'
  });

  // Form state
  const [formData, setFormData] = useState({
    // Asset Identification
    assetId: `AST-${Date.now()}`,
    barcode: '',
    assetType: 'IT', // IT or Non-IT
    parentAssetId: '',
    
    // Classification
    accountHead: '',
    category: '',
    subCategory: '',
    assetGroup: '',
    assetModel: '',
    manufacturer: '',
    
    // Core Details
    assetName: '',
    serialNumber: '',
    purchaseDate: '',
    capitalizationDate: '',
    vendor: '',
    invoiceNumber: '',
    assetValue: '',
    warrantyStart: '',
    warrantyEnd: '',
    amcApplicable: false,
    
    // IT Specific
    cpu: '',
    ram: '',
    storage: '',
    os: '',
    ipAddress: '',
    macAddress: '',
    hostname: '',
    softwareLicense: '',
    
    // Non-IT Specific
    dimensions: '',
    capacity: '',
    materialType: '',
    powerRating: '',
    installationDate: '',
    
    // Assignment
    department: '',
    costCenter: '',
    location: '',
    subLocation: '',
    assignedTo: '',
    custodian: '',
    
    // Status
    assetStatus: 'In Use',
    verificationStatus: 'Pending',
    verificationCycle: '',
    remarks: ''
  });

  // UI state
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [errors, setErrors] = useState({});
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showScanner, setShowScanner] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Cascading dropdowns state
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [filteredAssetGroups, setFilteredAssetGroups] = useState([]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  
  // Load draft from localStorage on mount
  // useEffect(() => {
  //   const draft = localStorage.getItem('assetDataDraft');
  //   if (draft) {
  //     const confirmed = window.confirm('Found a saved draft. Would you like to continue with it?');
  //     if (confirmed) {
  //       setFormData(JSON.parse(draft));
  //     }
  //   }
  // }, []);

  // Handle category change to filter sub-categories
  useEffect(() => {
    if (formData.category) {
      const filtered = mockData.subCategories.filter(
        sc => sc.categoryId === formData.category
      );
      setFilteredSubCategories(filtered);
    } else {
      setFilteredSubCategories([]);
    }
  }, [formData.category]);

  // Handle sub-category change to filter asset groups
  useEffect(() => {
    if (formData.subCategory) {
      const filtered = mockData.assetGroups.filter(
        ag => ag.subCategoryId === formData.subCategory
      );
      setFilteredAssetGroups(filtered);
    } else {
      setFilteredAssetGroups([]);
    }
  }, [formData.subCategory]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle barcode scan
  const handleBarcodeScan = (barcode) => {
    setFormData(prev => ({ ...prev, barcode }));
    setShowScanner(false);
    showToast('Barcode scanned successfully', 'success');
  };

  // Handle image capture
  const handleImageAdd = (imageData) => {
    if (images.length < 4) {
      setImages(prev => [...prev, {
        id: Date.now(),
        data: imageData,
        timestamp: new Date().toISOString()
      }]);
      showToast('Image captured', 'success');
    } else {
      showToast('Maximum 4 images allowed', 'error');
    }
  };

  // Handle image removal
  const handleImageRemove = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  // Handle location capture
  const handleLocationCapture = (locationData) => {
    setLocation(locationData);
    showToast('Location captured', 'success');
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Mandatory fields
    if (!formData.barcode) newErrors.barcode = 'Barcode is required';
    if (!formData.assetName) newErrors.assetName = 'Asset name is required';
    if (!formData.serialNumber) newErrors.serialNumber = 'Serial number is required';
    if (!formData.category) newErrors.category = 'Category is required';
    // if (!formData.assetValue) newErrors.assetValue = 'Asset value is required';

    // Numeric validations
    // if (formData.assetValue && isNaN(formData.assetValue)) {
    //   newErrors.assetValue = 'Must be a valid number';
    // }

    // IP Address validation (basic)
    // if (formData.assetType === 'IT' && formData.ipAddress) {
    //   const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    //   if (!ipRegex.test(formData.ipAddress)) {
    //     newErrors.ipAddress = 'Invalid IP address format';
    //   }
    // }

    // MAC Address validation
    // if (formData.assetType === 'IT' && formData.macAddress) {
    //   const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    //   if (!macRegex.test(formData.macAddress)) {
    //     newErrors.macAddress = 'Invalid MAC address format';
    //   }
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Show toast notification
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Save draft to localStorage
  // const saveDraft = () => {
  //   localStorage.setItem('assetDataDraft', JSON.stringify(formData));
  //   showToast('Draft saved locally', 'success');
  // };

  // Prepare API payload
  const preparePayload = () => {
    return {
      assetIdentification: {
        assetId: formData.assetId,
        barcode: formData.barcode,
        assetType: formData.assetType,
        parentAssetId: formData.parentAssetId || null,
        serialNumber: formData.serialNumber
      },
      classification: {
        accountHead: formData.accountHead,
        category: formData.category,
        subCategory: formData.subCategory,
        assetGroup: formData.assetGroup,
        assetModel: formData.assetModel,
        manufacturer: formData.manufacturer
      },
      coreDetails: {
        assetName: formData.assetName,
        purchaseDate: formData.purchaseDate,
        capitalizationDate: formData.capitalizationDate,
        vendor: formData.vendor,
        invoiceNumber: formData.invoiceNumber,
        assetValue: parseFloat(formData.assetValue),
        warrantyStart: formData.warrantyStart,
        warrantyEnd: formData.warrantyEnd,
        amcApplicable: formData.amcApplicable
      },
      specificDetails: formData.assetType === 'IT' ? {
        cpu: formData.cpu,
        ram: formData.ram,
        storage: formData.storage,
        os: formData.os,
        ipAddress: formData.ipAddress,
        macAddress: formData.macAddress,
        hostname: formData.hostname,
        softwareLicense: formData.softwareLicense
      } : {
        dimensions: formData.dimensions,
        capacity: formData.capacity,
        materialType: formData.materialType,
        powerRating: formData.powerRating,
        installationDate: formData.installationDate
      },
      assignment: {
        department: formData.department,
        costCenter: formData.costCenter,
        location: formData.location,
        subLocation: formData.subLocation,
        assignedTo: formData.assignedTo,
        custodian: formData.custodian
      },
      status: {
        assetStatus: formData.assetStatus,
        verificationStatus: formData.verificationStatus,
        verificationCycle: formData.verificationCycle,
        remarks: formData.remarks
      },
      metadata: {
        gpsCoordinates: location ? {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy
        } : null,
        timestamp: new Date().toISOString(),
        capturedBy: userContext.userName,
        capturedAtLocation: userContext.locationName
      },
      images: images.map((img, index) => ({
        imageIndex: index + 1,
        imageData: img.data,
        capturedAt: img.timestamp
      }))
    };
  };

  // Handle submit
  const handleSubmit = async (action = 'submit') => {
  if (!validateForm()) {
    showToast('Please fix validation errors', 'error');
    return;
  }

  setIsSaving(true);

  try {
    const payload = preparePayload();
console.log(payload);
    if (isOffline) {
      // Save to localStorage for later sync
      const offlineQueue = JSON.parse(localStorage.getItem('offlineAssetQueue') || '[]');
      offlineQueue.push({ ...payload, queuedAt: new Date().toISOString() });
      localStorage.setItem('offlineAssetQueue', JSON.stringify(offlineQueue));
      showToast('Saved offline. Will sync when online.', 'warning');
    } else {
      // ✅ REAL API CALL TO FLASK
      const response = await fetch("https://restrictively-unfleeced-blanche.ngrok-free.dev/api/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save asset");
      }

      console.log("Server response:", result);

      showToast(
        action === 'saveNext'
          ? 'Asset saved! Ready for next.'
          : 'Asset submitted for verification',
        'success'
      );

      // Clear draft and form
      localStorage.removeItem('assetDataDraft');

      if (action === 'saveNext') {
        // Reset form for next asset
        setFormData({
          ...formData,
          assetId: `AST-${Date.now()}`,
          barcode: '',
          assetName: '',
          serialNumber: '',
          // Keep classification and assignment fields
        });
        setImages([]);
        setLocation(null);
      }
    }
  } catch (error) {
    console.error('Error submitting asset:', error);
    showToast('Error submitting asset. Please try again.', 'error');
  } finally {
    setIsSaving(false);
  }
};

  
  return (
    <div className="asset-capture-container">
      {/* Header */}
      <header className="asset-capture-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Asset Data Capture</h1>
            <span className="app-name">Nuggetts EAM</span>
          </div>
          <div className="header-user-info">
            <div className="user-details">
              <span className="user-name">{userContext.userName}</span>
              <span className="user-role">{userContext.role}</span>
            </div>
            <div className="location-badge">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C5.2 0 3 2.2 3 5c0 3.5 5 11 5 11s5-7.5 5-11c0-2.8-2.2-5-5-5zm0 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
              </svg>
              {userContext.locationName}
            </div>
          </div>
        </div>
        
        {isOffline && (
          <div className="offline-banner">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 13H7v-2h2v2zm0-4H7V5h2v4z"/>
            </svg>
            Offline Mode - Data will sync when connection is restored
          </div>
        )}
      </header>

      {/* Main Form */}
      <form className="asset-capture-form">
        
        {/* Asset Identification Section */}
        <section className="form-section" data-section="identification">
          <h2 className="section-title">
            <span className="section-icon">🏷️</span>
            Asset Identification
          </h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Asset ID</label>
              <input
                type="text"
                name="assetId"
                
              />
            </div>

            <div className="form-group">
              <label>Barcode / QR Code *</label>
              <div className="input-with-action">
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  placeholder="Scan or enter barcode"
                  className={errors.barcode ? 'error' : ''}
                />
                <button
                  type="button"
                  className="scan-button"
                  onClick={() => setShowScanner(true)}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 4h2V2H3v2zm0 4h2V6H3v2zm0 4h2v-2H3v2zm0 4h2v-2H3v2zm4 0h2v-2H7v2zm8 0h2v-2h-2v2zm0-16v2h2V2h-2zM7 4h2V2H7v2zm8 12h2v-2h-2v2zM9 2v2h2V2H9zm6 0v2h2V2h-2zM9 16v2h2v-2H9zm6 0v2h2v-2h-2zM3 2v2h2V2H3zm14 14h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V6h-2v2z"/>
                  </svg>
                  Scan
                </button>
              </div>
              {errors.barcode && <span className="error-message">{errors.barcode}</span>}
            </div>

            <div className="form-group">
              <label>Asset Type *</label>
              <div className="asset-type-selector">
                <button
                  type="button"
                  className={`type-button ${formData.assetType === 'IT' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, assetType: 'IT' }))}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M18 2H2C.9 2 0 2.9 0 4v10c0 1.1.9 2 2 2h6v2H6v2h8v-2h-2v-2h6c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H2V4h16v10z"/>
                  </svg>
                  IT Asset
                </button>
                <button
                  type="button"
                  className={`type-button ${formData.assetType === 'Non-IT' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, assetType: 'Non-IT' }))}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.5 4.5c-.3-.3-.7-.5-1.1-.5H11V2c0-.6-.4-1-1-1s-1 .4-1 1v2H3.6c-.4 0-.8.2-1.1.5s-.4.7-.4 1.1v11.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h12.7c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V5.6c0-.4-.2-.8-.5-1.1zM10 16.7l-4.5-4.5 1.4-1.4 3.1 3.1 5.1-5.1 1.4 1.4L10 16.7z"/>
                  </svg>
                  Non-IT Asset
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Parent Asset ID (Optional)</label>
              <input
                type="text"
                name="parentAssetId"
                value={formData.parentAssetId}
                onChange={handleChange}
                placeholder="For child/component assets"
              />
            </div>
          </div>
        </section>

        {/* Classification Section */}
        <section className="form-section" data-section="classification">
          <h2 className="section-title">
            <span className="section-icon">📊</span>
            Asset Classification
          </h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Account Head</label>
              <select
                name="accountHead"
                value={formData.accountHead}
                onChange={handleChange}
              >
                <option value="">Select Account Head</option>
                {mockData.accountHeads.map(ah => (
                  <option key={ah.id} value={ah.id}>{ah.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Select Category</option>
                {mockData.categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label>Sub-category</label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                disabled={!formData.category}
              >
                <option value="">Select Sub-category</option>
                {filteredSubCategories.map(sc => (
                  <option key={sc.id} value={sc.id}>{sc.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Asset Group</label>
              <select
                name="assetGroup"
                value={formData.assetGroup}
                onChange={handleChange}
                disabled={!formData.subCategory}
              >
                <option value="">Select Asset Group</option>
                {filteredAssetGroups.map(ag => (
                  <option key={ag.id} value={ag.id}>{ag.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Asset Model</label>
              <select
                name="assetModel"
                value={formData.assetModel}
                onChange={handleChange}
              >
                <option value="">Select Model</option>
                {mockData.assetModels.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Manufacturer / Make</label>
              <select
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
              >
                <option value="">Select Manufacturer</option>
                {mockData.manufacturers.map(mfr => (
                  <option key={mfr.id} value={mfr.id}>{mfr.name}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Core Details Section */}
        <section className="form-section" data-section="core">
          <h2 className="section-title">
            <span className="section-icon">📝</span>
            Core Asset Details
          </h2>
          
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Asset Name / Description *</label>
              <input
                type="text"
                name="assetName"
                value={formData.assetName}
                onChange={handleChange}
                placeholder="Enter detailed asset description"
                className={errors.assetName ? 'error' : ''}
              />
              {errors.assetName && <span className="error-message">{errors.assetName}</span>}
            </div>

            <div className="form-group">
              <label>Serial Number *</label>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                placeholder="Manufacturer serial number"
                className={errors.serialNumber ? 'error' : ''}
              />
              {errors.serialNumber && <span className="error-message">{errors.serialNumber}</span>}
            </div>

            {/* <div className="form-group">
              <label>Purchase Date</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Capitalization Date</label>
              <input
                type="date"
                name="capitalizationDate"
                value={formData.capitalizationDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Vendor / Supplier</label>
              <input
                type="text"
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                placeholder="Vendor name"
              />
            </div>

            <div className="form-group">
              <label>Invoice Number</label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                placeholder="Purchase invoice #"
              />
            </div>

            <div className="form-group">
              <label>Asset Value (₹) *</label>
              <input
                type="number"
                name="assetValue"
                value={formData.assetValue}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                className={errors.assetValue ? 'error' : ''}
              />
              {errors.assetValue && <span className="error-message">{errors.assetValue}</span>}
            </div>

            <div className="form-group">
              <label>Warranty Start</label>
              <input
                type="date"
                name="warrantyStart"
                value={formData.warrantyStart}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Warranty End</label>
              <input
                type="date"
                name="warrantyEnd"
                value={formData.warrantyEnd}
                onChange={handleChange}
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="amcApplicable"
                  checked={formData.amcApplicable}
                  onChange={handleChange}
                />
                <span>AMC Applicable</span>
              </label>
            </div> */}
          </div>
        </section>

        {/* IT-Specific Fields */}
        {/* {formData.assetType === 'IT' && (
          <section className="form-section asset-type-section it-section" data-section="it-specific">
            <h2 className="section-title">
              <span className="section-icon">💻</span>
              IT Asset Specifications
            </h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>CPU / Processor</label>
                <input
                  type="text"
                  name="cpu"
                  value={formData.cpu}
                  onChange={handleChange}
                  placeholder="e.g., Intel Core i7-12700"
                />
              </div>

              <div className="form-group">
                <label>RAM</label>
                <input
                  type="text"
                  name="ram"
                  value={formData.ram}
                  onChange={handleChange}
                  placeholder="e.g., 16GB DDR4"
                />
              </div>

              <div className="form-group">
                <label>Storage (HDD/SSD)</label>
                <input
                  type="text"
                  name="storage"
                  value={formData.storage}
                  onChange={handleChange}
                  placeholder="e.g., 512GB SSD"
                />
              </div>

              <div className="form-group">
                <label>Operating System</label>
                <select
                  name="os"
                  value={formData.os}
                  onChange={handleChange}
                >
                  <option value="">Select OS</option>
                  <option value="Windows 11">Windows 11</option>
                  <option value="Windows 10">Windows 10</option>
                  <option value="macOS">macOS</option>
                  <option value="Linux">Linux</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>IP Address</label>
                <input
                  type="text"
                  name="ipAddress"
                  value={formData.ipAddress}
                  onChange={handleChange}
                  placeholder="192.168.1.100"
                  className={errors.ipAddress ? 'error' : ''}
                />
                {errors.ipAddress && <span className="error-message">{errors.ipAddress}</span>}
              </div>

              <div className="form-group">
                <label>MAC Address</label>
                <input
                  type="text"
                  name="macAddress"
                  value={formData.macAddress}
                  onChange={handleChange}
                  placeholder="00:1B:44:11:3A:B7"
                  className={errors.macAddress ? 'error' : ''}
                />
                {errors.macAddress && <span className="error-message">{errors.macAddress}</span>}
              </div>

              <div className="form-group">
                <label>Hostname</label>
                <input
                  type="text"
                  name="hostname"
                  value={formData.hostname}
                  onChange={handleChange}
                  placeholder="WORKSTATION-001"
                />
              </div>

              <div className="form-group">
                <label>Software License Key</label>
                <input
                  type="text"
                  name="softwareLicense"
                  value={formData.softwareLicense}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>
            </div>
          </section>
        )} */}

        {/* Non-IT Specific Fields */}
        {/* {formData.assetType === 'Non-IT' && (
          <section className="form-section asset-type-section non-it-section" data-section="non-it-specific">
            <h2 className="section-title">
              <span className="section-icon">🏗️</span>
              Non-IT Asset Specifications
            </h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Physical Dimensions</label>
                <input
                  type="text"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  placeholder="e.g., 120x80x75 cm (LxWxH)"
                />
              </div>

              <div className="form-group">
                <label>Capacity / Rating</label>
                <input
                  type="text"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="e.g., 5 tons, 100 liters"
                />
              </div>

              <div className="form-group">
                <label>Material Type</label>
                <input
                  type="text"
                  name="materialType"
                  value={formData.materialType}
                  onChange={handleChange}
                  placeholder="e.g., Stainless Steel, Aluminum"
                />
              </div>

              <div className="form-group">
                <label>Power Rating</label>
                <input
                  type="text"
                  name="powerRating"
                  value={formData.powerRating}
                  onChange={handleChange}
                  placeholder="e.g., 2.5 kW, 220V"
                />
              </div>

              <div className="form-group">
                <label>Installation Date</label>
                <input
                  type="date"
                  name="installationDate"
                  value={formData.installationDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>
        )} */}

        {/* Image Capture Section */}
        <section className="form-section" data-section="images">
          <h2 className="section-title">
            <span className="section-icon">📸</span>
            Asset Images (Up to 4)
          </h2>
          
          <ImageCapture
            images={images}
            onImageAdd={handleImageAdd}
            onImageRemove={handleImageRemove}
            maxImages={4}
          />
        </section>

        {/* Location & Metadata Section */}
        <section className="form-section" data-section="location">
          <h2 className="section-title">
            <span className="section-icon">📍</span>
            Location & Audit Metadata
          </h2>
          
          <LocationTracker
            location={location}
            onLocationCapture={handleLocationCapture}
            userRole={userContext.role}
          />
        </section>

        {/* Assignment Section */}
        <section className="form-section" data-section="assignment">
          <h2 className="section-title">
            <span className="section-icon">👥</span>
            Assignment & Ownership
          </h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                {mockData.departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Cost Center</label>
              <select
                name="costCenter"
                value={formData.costCenter}
                onChange={handleChange}
              >
                <option value="">Select Cost Center</option>
                {mockData.costCenters.map(cc => (
                  <option key={cc.id} value={cc.id}>{cc.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Location</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
              >
                <option value="">Select Location</option>
                {mockData.locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Sub-location</label>
              <input
                type="text"
                name="subLocation"
                value={formData.subLocation}
                onChange={handleChange}
                placeholder="Floor, Room, Building"
              />
            </div>

            <div className="form-group">
              <label>Assigned To</label>
              <input
                type="text"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                placeholder="Employee / Room / Vehicle"
              />
            </div>

            <div className="form-group">
              <label>Custodian Name</label>
              <input
                type="text"
                name="custodian"
                value={formData.custodian}
                onChange={handleChange}
                placeholder="Person responsible"
              />
            </div>
          </div>
        </section>

        {/* Status Section */}
        <section className="form-section" data-section="status">
          <h2 className="section-title">
            <span className="section-icon">✓</span>
            Compliance & Status
          </h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Asset Status</label>
              <select
                name="assetStatus"
                value={formData.assetStatus}
                onChange={handleChange}
              >
                <option value="In Use">In Use</option>
                <option value="In Store">In Store</option>
                <option value="Under Repair">Under Repair</option>
                <option value="Scrapped">Scrapped</option>
              </select>
            </div>

            <div className="form-group">
              <label>Verification Status</label>
              <select
                name="verificationStatus"
                value={formData.verificationStatus}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
              </select>
            </div>

            <div className="form-group">
              <label>Verification Cycle</label>
              <select
                name="verificationCycle"
                value={formData.verificationCycle}
                onChange={handleChange}
              >
                <option value="">Select Cycle</option>
                <option value="Q1-2026">Q1-2026</option>
                <option value="Q2-2026">Q2-2026</option>
                <option value="Q3-2026">Q3-2026</option>
                <option value="Q4-2026">Q4-2026</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Remarks / Notes</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="3"
                placeholder="Additional notes, observations, or special instructions..."
              />
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="form-actions">
          {/* <button
            type="button"
            className="btn btn-secondary"
            onClick={saveDraft}
            disabled={isSaving}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M14 0H2C.9 0 0 .9 0 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zM7 2h2v4H7V2zm5 12H4V8h8v6z"/>
            </svg>
            Save Draft
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleSubmit('saveNext')}
            disabled={isSaving}
          >
            {isSaving ? (
              <span className="loading-spinner"></span>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0L6.6 1.4 11.2 6H0v2h11.2l-4.6 4.6L8 14l6-6z"/>
              </svg>
            )}
            Save & Next Asset
          </button> */}

          <button
            type="button"
            className="btn btn-success"
            onClick={() => handleSubmit('submit')}
            disabled={isSaving}
          >
            {isSaving ? (
              <span className="loading-spinner"></span>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.8 2.2c-.3-.3-.7-.2-1 0L6 8.6 3.2 5.8c-.3-.3-.8-.3-1.1 0-.3.3-.3.8 0 1.1l3.4 3.4c.3.3.7.3 1 0l7.3-7.1c.3-.3.3-.7 0-1z"/>
              </svg>
            )}
            Submit
          </button>
        </div>
      </form>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            {toast.type === 'success' && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zm5 8l-6 6-4-4 1.4-1.4 2.6 2.6 4.6-4.6L15 8z"/>
              </svg>
            )}
            {toast.type === 'error' && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zm5 13.6L13.6 15 10 11.4 6.4 15 5 13.6 8.6 10 5 6.4 6.4 5 10 8.6 13.6 5 15 6.4 11.4 10 15 13.6z"/>
              </svg>
            )}
            {toast.type === 'warning' && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"/>
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetDataCapture;
