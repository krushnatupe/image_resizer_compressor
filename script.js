// ============================================
// Image Resizer & Compressor - Main JavaScript
// ============================================

// Global State
const state = {
    images: [],
    processedImages: [],
    currentImageIndex: 0,
    theme: 'light',
    resizeMode: 'custom',
    compressionMode: 'quality',
    previewMode: 'sidebyside'
};

// DOM Elements
const elements = {
    // Upload
    uploadArea: document.getElementById('uploadArea'),
    fileInput: document.getElementById('fileInput'),
    imageListSection: document.getElementById('imageListSection'),
    imageList: document.getElementById('imageList'),
    clearAllBtn: document.getElementById('clearAllBtn'),
    downloadAllBtn: document.getElementById('downloadAllBtn'),
    
    // Processing
    processingSection: document.getElementById('processingSection'),
    
    // Resize
    resizeTabs: document.querySelectorAll('.tab-btn'),
    customTab: document.getElementById('customTab'),
    percentageTab: document.getElementById('percentageTab'),
    presetTab: document.getElementById('presetTab'),
    widthInput: document.getElementById('widthInput'),
    heightInput: document.getElementById('heightInput'),
    maintainAspectRatio: document.getElementById('maintainAspectRatio'),
    preventUpscaling: document.getElementById('preventUpscaling'),
    preventDownscaling: document.getElementById('preventDownscaling'),
    percentageButtons: document.querySelectorAll('.percentage-btn'),
    customPercentage: document.getElementById('customPercentage'),
    presetButtons: document.querySelectorAll('.preset-btn'),
    
    // Compression
    compressionModeRadios: document.querySelectorAll('input[name="compressionMode"]'),
    qualitySection: document.getElementById('qualitySection'),
    targetSizeSection: document.getElementById('targetSizeSection'),
    qualitySlider: document.getElementById('qualitySlider'),
    qualityValue: document.getElementById('qualityValue'),
    losslessMode: document.getElementById('losslessMode'),
    autoOptimize: document.getElementById('autoOptimize'),
    targetButtons: document.querySelectorAll('.target-btn'),
    targetSizeInput: document.getElementById('targetSizeInput'),
    targetSizeUnit: document.getElementById('targetSizeUnit'),
    
    // Format
    outputFormatRadios: document.querySelectorAll('input[name="outputFormat"]'),
    
    // Actions
    resetBtn: document.getElementById('resetBtn'),
    processBtn: document.getElementById('processBtn'),
    
    // Preview
    previewContainer: document.getElementById('previewContainer'),
    previewPlaceholder: document.getElementById('previewPlaceholder'),
    previewModeButtons: document.querySelectorAll('.preview-mode-btn'),
    imageInfo: document.getElementById('imageInfo'),
    originalSize: document.getElementById('originalSize'),
    originalDimensions: document.getElementById('originalDimensions'),
    outputSize: document.getElementById('outputSize'),
    outputDimensions: document.getElementById('outputDimensions'),
    reduction: document.getElementById('reduction'),
    qualityUsed: document.getElementById('qualityUsed'),
    outputFormatInfo: document.getElementById('outputFormatInfo'),
    
    // Download
    downloadSection: document.getElementById('downloadSection'),
    fileName: document.getElementById('fileName'),
    downloadBtn: document.getElementById('downloadBtn'),
    
    // Theme
    themeToggle: document.getElementById('themeToggle'),
    
    // Toast
    toastContainer: document.getElementById('toastContainer'),
    
    // Loading
    loadingOverlay: document.getElementById('loadingOverlay'),
    loadingText: document.getElementById('loadingText'),
    
    // Canvas
    processingCanvas: document.getElementById('processingCanvas'),
    
    // Contact Form
    contactForm: document.getElementById('contactForm'),
    contactName: document.getElementById('contactName'),
    contactEmail: document.getElementById('contactEmail'),
    contactSubject: document.getElementById('contactSubject'),
    contactMessage: document.getElementById('contactMessage')
};

// ============================================
// Utility Functions
// ============================================

/**
 * Format file size in human-readable format
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Parse file size string to bytes
 */
function parseFileSize(sizeStr) {
    const match = sizeStr.match(/^(\d+\.?\d*)\s*(KB|MB|GB)?$/i);
    if (!match) return 0;
    
    const value = parseFloat(match[1]);
    const unit = (match[2] || 'KB').toUpperCase();
    
    const multipliers = {
        'KB': 1024,
        'MB': 1024 * 1024,
        'GB': 1024 * 1024 * 1024
    };
    
    return value * (multipliers[unit] || 1024);
}

/**
 * Get file extension from MIME type
 */
function getExtensionFromMimeType(mimeType) {
    const mimeToExt = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
        'image/bmp': 'bmp',
        'image/svg+xml': 'svg',
        'image/avif': 'avif',
        'image/tiff': 'tiff',
        'image/x-tiff': 'tiff'
    };
    return mimeToExt[mimeType] || 'jpg';
}

/**
 * Get MIME type from extension
 */
function getMimeTypeFromExtension(ext) {
    const extToMime = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'webp': 'image/webp',
        'gif': 'image/gif',
        'bmp': 'image/bmp',
        'svg': 'image/svg+xml',
        'avif': 'image/avif',
        'tiff': 'image/tiff'
    };
    return extToMime[ext.toLowerCase()] || 'image/jpeg';
}

/**
 * Check if browser supports format
 */
function isFormatSupported(mimeType) {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL(mimeType).indexOf(mimeType) >= 0;
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// Theme Management
// ============================================

/**
 * Initialize theme
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    state.theme = savedTheme || systemTheme;
    applyTheme();
}

/**
 * Apply theme to document
 */
function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('theme', state.theme);
}

/**
 * Toggle theme
 */
function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme();
}

// ============================================
// Toast Notifications
// ============================================

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
        error: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
        warning: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
        info: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    };
    
    toast.innerHTML = `
        ${icons[type] || icons.info}
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Close notification">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    // Close button handler
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

// ============================================
// Loading Overlay
// ============================================

/**
 * Show loading overlay
 */
function showLoading(text = 'Processing images...') {
    elements.loadingText.textContent = text;
    elements.loadingOverlay.style.display = 'flex';
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    elements.loadingOverlay.style.display = 'none';
}

// ============================================
// Image Upload Functions
// ============================================

/**
 * Load images from file input
 */
async function loadImages(files) {
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
        showToast('Please select valid image files', 'error');
        return;
    }
    
    for (const file of validFiles) {
        try {
            const imageData = await loadImageFile(file);
            state.images.push(imageData);
        } catch (error) {
            console.error('Error loading image:', error);
            showToast(`Failed to load ${file.name}`, 'error');
        }
    }
    
    if (state.images.length > 0) {
        updateImageList();
        elements.imageListSection.style.display = 'block';
        elements.processingSection.style.display = 'block';
        showToast(`Loaded ${validFiles.length} image(s)`, 'success');
    }
}

/**
 * Load single image file
 */
function loadImageFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    id: Date.now() + Math.random(),
                    name: file.name,
                    originalFile: file,
                    originalDataUrl: e.target.result,
                    originalSize: file.size,
                    originalWidth: img.width,
                    originalHeight: img.height,
                    originalType: file.type,
                    image: img
                });
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };
        
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Handle paste from clipboard
 */
async function handlePaste(e) {
    const items = e.clipboardData?.items;
    if (!items) return;
    
    const files = [];
    for (const item of items) {
        if (item.type.startsWith('image/')) {
            files.push(item.getAsFile());
        }
    }
    
    if (files.length > 0) {
        e.preventDefault();
        await loadImages(files);
    }
}

/**
 * Update image list display
 */
function updateImageList() {
    elements.imageList.innerHTML = '';
    
    state.images.forEach((imageData, index) => {
        const item = document.createElement('div');
        item.className = 'image-item';
        item.innerHTML = `
            <img src="${imageData.originalDataUrl}" alt="${imageData.name}">
            <button class="image-item-remove" data-index="${index}" aria-label="Remove image">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <div class="image-item-info">
                <div class="image-item-name">${imageData.name}</div>
                <div class="image-item-size">${formatFileSize(imageData.originalSize)}</div>
            </div>
        `;
        
        // Click to select
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.image-item-remove')) {
                selectImage(index);
            }
        });
        
        // Remove button
        item.querySelector('.image-item-remove').addEventListener('click', (e) => {
            e.stopPropagation();
            removeImage(index);
        });
        
        elements.imageList.appendChild(item);
    });
}

/**
 * Select image for processing
 */
function selectImage(index) {
    state.currentImageIndex = index;
    const imageData = state.images[index];
    
    // Update UI with original image info
    elements.originalSize.textContent = formatFileSize(imageData.originalSize);
    elements.originalDimensions.textContent = `${imageData.originalWidth} × ${imageData.originalHeight}`;
    
    // Set file name input
    const nameWithoutExt = imageData.name.replace(/\.[^/.]+$/, '');
    elements.fileName.value = nameWithoutExt;
    
    // Highlight selected item
    document.querySelectorAll('.image-item').forEach((item, i) => {
        item.style.border = i === index ? '3px solid var(--primary-color)' : 'none';
    });
    
    showToast(`Selected: ${imageData.name}`, 'info');
}

/**
 * Remove image from list
 */
function removeImage(index) {
    state.images.splice(index, 1);
    state.processedImages.splice(index, 1);
    updateImageList();
    
    if (state.images.length === 0) {
        elements.imageListSection.style.display = 'none';
        elements.processingSection.style.display = 'none';
        resetForm();
    } else {
        selectImage(0);
    }
    
    showToast('Image removed', 'info');
}

/**
 * Clear all images
 */
function clearAllImages() {
    state.images = [];
    state.processedImages = [];
    updateImageList();
    elements.imageListSection.style.display = 'none';
    elements.processingSection.style.display = 'none';
    resetForm();
    showToast('All images cleared', 'info');
}

// ============================================
// Resize Functions
// ============================================

/**
 * Calculate new dimensions maintaining aspect ratio
 */
function calculateAspectRatio(originalWidth, originalHeight, newWidth, newHeight, maintainRatio) {
    if (!maintainRatio) {
        return { width: newWidth, height: newHeight };
    }
    
    const aspectRatio = originalWidth / originalHeight;
    
    if (newWidth && !newHeight) {
        return {
            width: newWidth,
            height: Math.round(newWidth / aspectRatio)
        };
    }
    
    if (newHeight && !newWidth) {
        return {
            width: Math.round(newHeight * aspectRatio),
            height: newHeight
        };
    }
    
    if (newWidth && newHeight) {
        // Use the dimension that results in smaller image
        const widthBasedHeight = Math.round(newWidth / aspectRatio);
        const heightBasedWidth = Math.round(newHeight * aspectRatio);
        
        if (widthBasedHeight <= newHeight) {
            return { width: newWidth, height: widthBasedHeight };
        } else {
            return { width: heightBasedWidth, height: newHeight };
        }
    }
    
    return { width: originalWidth, height: originalHeight };
}

/**
 * Apply resize constraints
 */
function applyResizeConstraints(originalWidth, originalHeight, targetWidth, targetHeight, preventUpscaling, preventDownscaling) {
    let newWidth = targetWidth || originalWidth;
    let newHeight = targetHeight || originalHeight;
    
    if (preventUpscaling) {
        newWidth = Math.min(newWidth, originalWidth);
        newHeight = Math.min(newHeight, originalHeight);
    }
    
    if (preventDownscaling) {
        newWidth = Math.max(newWidth, originalWidth);
        newHeight = Math.max(newHeight, originalHeight);
    }
    
    return { width: newWidth, height: newHeight };
}

/**
 * Resize image using canvas
 */
function resizeImage(imageData, width, height) {
    const canvas = elements.processingCanvas;
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;
    
    // Use high-quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    ctx.drawImage(imageData.image, 0, 0, width, height);
    
    return canvas;
}

// ============================================
// Compression Functions
// ============================================

/**
 * Compress image to target file size
 */
async function compressToTargetSize(imageData, targetSizeBytes, outputFormat, maxIterations = 20) {
    const canvas = resizeImage(imageData, imageData.originalWidth, imageData.originalHeight);
    const ctx = canvas.getContext('2d');
    
    let quality = 0.95;
    let minQuality = 0.1;
    let maxQuality = 1.0;
    let bestBlob = null;
    let bestQuality = quality;
    let iteration = 0;
    
    // Check if target is larger than original
    if (targetSizeBytes > imageData.originalSize) {
        // Try to increase file size
        quality = 1.0;
        let blob = await canvasToBlob(canvas, outputFormat, quality);
        
        if (blob.size >= targetSizeBytes || blob.size >= imageData.originalSize) {
            return {
                blob,
                quality,
                message: blob.size >= targetSizeBytes ? 'Target size achieved' : 'Maximum quality used'
            };
        }
        
        // Try less efficient compression by reducing dimensions slightly
        const scaleFactor = 0.95;
        const newWidth = Math.round(imageData.originalWidth * scaleFactor);
        const newHeight = Math.round(imageData.originalHeight * scaleFactor);
        const resizedCanvas = resizeImage(imageData, newWidth, newHeight);
        blob = await canvasToBlob(resizedCanvas, outputFormat, 1.0);
        
        if (blob.size >= targetSizeBytes) {
            return {
                blob,
                quality: 1.0,
                message: 'Target size achieved with slight dimension reduction'
            };
        }
        
        return {
            blob,
            quality: 1.0,
            message: 'The requested file size cannot be achieved naturally. Output generated with the highest available quality.'
        };
    }
    
    // Binary search for optimal quality
    while (iteration < maxIterations) {
        const blob = await canvasToBlob(canvas, outputFormat, quality);
        
        if (Math.abs(blob.size - targetSizeBytes) / targetSizeBytes <= 0.05) {
            // Within 5% tolerance
            return { blob, quality, message: 'Target size achieved' };
        }
        
        if (blob.size > targetSizeBytes) {
            maxQuality = quality;
            bestBlob = blob;
            bestQuality = quality;
        } else {
            minQuality = quality;
            bestBlob = blob;
            bestQuality = quality;
        }
        
        quality = (minQuality + maxQuality) / 2;
        iteration++;
    }
    
    // If still too large, try reducing dimensions
    if (bestBlob.size > targetSizeBytes) {
        let scaleFactor = 0.95;
        let dimIteration = 0;
        
        while (bestBlob.size > targetSizeBytes && dimIteration < 10 && scaleFactor > 0.5) {
            const newWidth = Math.round(imageData.originalWidth * scaleFactor);
            const newHeight = Math.round(imageData.originalHeight * scaleFactor);
            const resizedCanvas = resizeImage(imageData, newWidth, newHeight);
            bestBlob = await canvasToBlob(resizedCanvas, outputFormat, 0.7);
            scaleFactor -= 0.05;
            dimIteration++;
        }
    }
    
    return {
        blob: bestBlob,
        quality: bestQuality,
        message: 'Best possible compression achieved'
    };
}

/**
 * Compress image with quality setting
 */
async function compressWithQuality(imageData, quality, outputFormat, lossless) {
    const canvas = resizeImage(imageData, imageData.originalWidth, imageData.originalHeight);
    const blob = await canvasToBlob(canvas, outputFormat, lossless ? 1.0 : quality / 100);
    return { blob, quality: lossless ? 100 : quality };
}

/**
 * Convert canvas to blob
 */
function canvasToBlob(canvas, mimeType, quality) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('Failed to create blob'));
            }
        }, mimeType, quality);
    });
}

/**
 * Auto optimize quality
 */
function autoOptimizeQuality(originalSize, targetSize) {
    if (!targetSize) return 85;
    
    const ratio = targetSize / originalSize;
    
    if (ratio >= 0.9) return 95;
    if (ratio >= 0.7) return 90;
    if (ratio >= 0.5) return 85;
    if (ratio >= 0.3) return 75;
    if (ratio >= 0.2) return 65;
    return 55;
}

// ============================================
// Format Conversion
// ============================================

/**
 * Convert image to different format
 */
async function convertImageFormat(imageData, targetFormat) {
    if (targetFormat === 'original') {
        return imageData.originalType;
    }
    
    const mimeType = getMimeTypeFromExtension(targetFormat);
    
    if (!isFormatSupported(mimeType)) {
        showToast(`Format ${targetFormat.toUpperCase()} is not supported in this browser`, 'error');
        return imageData.originalType;
    }
    
    return mimeType;
}

// ============================================
// Main Processing Function
// ============================================

/**
 * Process single image
 */
async function processImage(imageData, options) {
    const {
        width,
        height,
        quality,
        targetSize,
        outputFormat,
        compressionMode,
        maintainAspectRatio,
        preventUpscaling,
        preventDownscaling,
        losslessMode
    } = options;
    
    // Calculate dimensions
    let targetWidth = width || imageData.originalWidth;
    let targetHeight = height || imageData.originalHeight;
    
    if (maintainAspectRatio) {
        const dims = calculateAspectRatio(
            imageData.originalWidth,
            imageData.originalHeight,
            targetWidth,
            targetHeight,
            true
        );
        targetWidth = dims.width;
        targetHeight = dims.height;
    }
    
    const constrainedDims = applyResizeConstraints(
        imageData.originalWidth,
        imageData.originalHeight,
        targetWidth,
        targetHeight,
        preventUpscaling,
        preventDownscaling
    );
    
    // Convert format
    const mimeType = await convertImageFormat(imageData, outputFormat);
    
    // Resize image
    const resizedCanvas = resizeImage(imageData, constrainedDims.width, constrainedDims.height);
    
    // Compress
    let result;
    if (compressionMode === 'targetSize' && targetSize) {
        const targetSizeBytes = parseFileSize(targetSize);
        result = await compressToTargetSize(
            { ...imageData, originalWidth: constrainedDims.width, originalHeight: constrainedDims.height },
            targetSizeBytes,
            mimeType
        );
    } else {
        const finalQuality = losslessMode ? 100 : quality;
        result = await compressWithQuality(
            { ...imageData, originalWidth: constrainedDims.width, originalHeight: constrainedDims.height },
            finalQuality,
            mimeType,
            losslessMode
        );
    }
    
    // Create data URL for preview
    const dataUrl = await blobToDataUrl(result.blob);
    
    return {
        ...imageData,
        processedBlob: result.blob,
        processedDataUrl: dataUrl,
        processedSize: result.blob.size,
        processedWidth: constrainedDims.width,
        processedHeight: constrainedDims.height,
        processedType: mimeType,
        qualityUsed: result.quality,
        message: result.message
    };
}

/**
 * Convert blob to data URL
 */
function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * Process all images
 */
async function processAllImages() {
    if (state.images.length === 0) {
        showToast('Please upload images first', 'error');
        return;
    }
    
    showLoading('Processing images...');
    
    try {
        const options = getProcessingOptions();
        
        state.processedImages = [];
        
        for (let i = 0; i < state.images.length; i++) {
            elements.loadingText.textContent = `Processing image ${i + 1} of ${state.images.length}...`;
            const processed = await processImage(state.images[i], options);
            state.processedImages.push(processed);
        }
        
        updatePreview();
        showToast('All images processed successfully', 'success');
    } catch (error) {
        console.error('Processing error:', error);
        showToast('Error processing images', 'error');
    } finally {
        hideLoading();
    }
}

/**
 * Get current processing options
 */
function getProcessingOptions() {
    const compressionMode = document.querySelector('input[name="compressionMode"]:checked').value;
    const outputFormat = document.querySelector('input[name="outputFormat"]:checked').value;
    
    let targetSize = null;
    if (compressionMode === 'targetSize') {
        const size = parseFloat(elements.targetSizeInput.value);
        const unit = elements.targetSizeUnit.value;
        if (size > 0) {
            targetSize = `${size} ${unit}`;
        }
    }
    
    return {
        width: elements.widthInput.value ? parseInt(elements.widthInput.value) : null,
        height: elements.heightInput.value ? parseInt(elements.heightInput.value) : null,
        quality: parseInt(elements.qualitySlider.value),
        targetSize,
        outputFormat,
        compressionMode,
        maintainAspectRatio: elements.maintainAspectRatio.checked,
        preventUpscaling: elements.preventUpscaling.checked,
        preventDownscaling: elements.preventDownscaling.checked,
        losslessMode: elements.losslessMode.checked
    };
}

// ============================================
// Preview Functions
// ============================================

/**
 * Update preview display
 */
function updatePreview() {
    if (state.processedImages.length === 0) {
        elements.previewPlaceholder.style.display = 'block';
        elements.imageInfo.style.display = 'none';
        elements.downloadSection.style.display = 'none';
        return;
    }
    
    const processed = state.processedImages[state.currentImageIndex];
    const original = state.images[state.currentImageIndex];
    
    elements.previewPlaceholder.style.display = 'none';
    elements.imageInfo.style.display = 'block';
    elements.downloadSection.style.display = 'block';
    
    // Update info
    elements.originalSize.textContent = formatFileSize(original.originalSize);
    elements.originalDimensions.textContent = `${original.originalWidth} × ${original.originalHeight}`;
    elements.outputSize.textContent = formatFileSize(processed.processedSize);
    elements.outputDimensions.textContent = `${processed.processedWidth} × ${processed.processedHeight}`;
    
    const reduction = ((1 - processed.processedSize / original.originalSize) * 100).toFixed(1);
    elements.reduction.textContent = reduction > 0 ? `${reduction}%` : '0%';
    elements.qualityUsed.textContent = `${Math.round(processed.qualityUsed)}%`;
    elements.outputFormatInfo.textContent = getExtensionFromMimeType(processed.processedType).toUpperCase();
    
    // Update preview based on mode
    if (state.previewMode === 'sidebyside') {
        updateSideBySidePreview(original, processed);
    } else {
        updateSliderPreview(original, processed);
    }
}

/**
 * Update side by side preview
 */
function updateSideBySidePreview(original, processed) {
    elements.previewContainer.innerHTML = `
        <div class="preview-sidebyside">
            <div class="preview-sidebyside-item">
                <span class="preview-label">Original</span>
                <img src="${original.originalDataUrl}" alt="Original">
            </div>
            <div class="preview-sidebyside-item">
                <span class="preview-label">Processed</span>
                <img src="${processed.processedDataUrl}" alt="Processed">
            </div>
        </div>
    `;
}

/**
 * Update slider preview
 */
function updateSliderPreview(original, processed) {
    elements.previewContainer.innerHTML = `
        <div class="preview-slider">
            <div class="preview-slider-container">
                <img class="preview-slider-original" src="${original.originalDataUrl}" alt="Original">
                <img class="preview-slider-processed" src="${processed.processedDataUrl}" alt="Processed">
                <div class="preview-slider-handle" id="sliderHandle"></div>
            </div>
        </div>
    `;
    
    // Initialize slider interaction
    initSliderInteraction();
}

/**
 * Initialize slider interaction
 */
function initSliderInteraction() {
    const handle = document.getElementById('sliderHandle');
    const processed = document.querySelector('.preview-slider-processed');
    const container = document.querySelector('.preview-slider-container');
    
    if (!handle || !processed || !container) return;
    
    let isDragging = false;
    
    const updateSlider = (clientX) => {
        const rect = container.getBoundingClientRect();
        let x = clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        const percentage = (x / rect.width) * 100;
        
        handle.style.left = `${percentage}%`;
        processed.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    };
    
    handle.addEventListener('mousedown', () => isDragging = true);
    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('mousemove', (e) => {
        if (isDragging) updateSlider(e.clientX);
    });
    
    // Touch support
    handle.addEventListener('touchstart', () => isDragging = true);
    document.addEventListener('touchend', () => isDragging = false);
    document.addEventListener('touchmove', (e) => {
        if (isDragging) updateSlider(e.touches[0].clientX);
    });
}

// ============================================
// Download Functions
// ============================================

/**
 * Download single image
 */
function downloadImage(index = state.currentImageIndex) {
    const processed = state.processedImages[index];
    if (!processed) return;
    
    const link = document.createElement('a');
    const fileName = elements.fileName.value || processed.name.replace(/\.[^/.]+$/, '');
    const extension = getExtensionFromMimeType(processed.processedType);
    link.download = `${fileName}.${extension}`;
    link.href = processed.processedDataUrl;
    link.click();
    
    showToast('Image downloaded', 'success');
}

/**
 * Download all images as ZIP
 */
async function downloadAllAsZip() {
    if (state.processedImages.length === 0) {
        showToast('Process images first', 'error');
        return;
    }
    
    showLoading('Creating ZIP file...');
    
    try {
        // Simple ZIP implementation using JSZip would be ideal, but for vanilla JS
        // we'll download individual files
        for (let i = 0; i < state.processedImages.length; i++) {
            const processed = state.processedImages[i];
            const link = document.createElement('a');
            const fileName = processed.name.replace(/\.[^/.]+$/, '');
            const extension = getExtensionFromMimeType(processed.processedType);
            link.download = `${fileName}_processed.${extension}`;
            link.href = processed.processedDataUrl;
            link.click();
            
            // Small delay between downloads
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        showToast('All images downloaded', 'success');
    } catch (error) {
        console.error('Download error:', error);
        showToast('Error downloading images', 'error');
    } finally {
        hideLoading();
    }
}

// ============================================
// Form Reset
// ============================================

/**
 * Reset form to default state
 */
function resetForm() {
    elements.widthInput.value = '';
    elements.heightInput.value = '';
    elements.maintainAspectRatio.checked = true;
    elements.preventUpscaling.checked = false;
    elements.preventDownscaling.checked = false;
    elements.qualitySlider.value = 85;
    elements.qualityValue.textContent = '85';
    elements.losslessMode.checked = false;
    elements.autoOptimize.checked = true;
    elements.targetSizeInput.value = '';
    elements.targetSizeUnit.value = 'KB';
    
    // Reset tabs
    elements.resizeTabs.forEach(btn => btn.classList.remove('active'));
    elements.resizeTabs[0].classList.add('active');
    elements.customTab.classList.add('active');
    elements.percentageTab.classList.remove('active');
    elements.presetTab.classList.remove('active');
    
    // Reset percentage buttons
    elements.percentageButtons.forEach(btn => btn.classList.remove('active'));
    elements.percentageButtons[3].classList.add('active');
    
    // Reset compression mode
    elements.compressionModeRadios[0].checked = true;
    elements.qualitySection.style.display = 'block';
    elements.targetSizeSection.style.display = 'none';
    
    // Reset format
    elements.outputFormatRadios[0].checked = true;
    
    // Reset preview
    elements.previewContainer.innerHTML = '';
    elements.previewContainer.appendChild(elements.previewPlaceholder);
    elements.previewPlaceholder.style.display = 'block';
    elements.imageInfo.style.display = 'none';
    elements.downloadSection.style.display = 'none';
    
    showToast('Form reset', 'info');
}

// ============================================
// Event Listeners
// ============================================

/**
 * Initialize all event listeners
 */
function initEventListeners() {
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // File input
    elements.fileInput.addEventListener('change', (e) => {
        loadImages(e.target.files);
        e.target.value = ''; // Reset input
    });
    
    // Drag and drop
    elements.uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.uploadArea.classList.add('drag-over');
    });
    
    elements.uploadArea.addEventListener('dragleave', () => {
        elements.uploadArea.classList.remove('drag-over');
    });
    
    elements.uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.uploadArea.classList.remove('drag-over');
        loadImages(e.dataTransfer.files);
    });
    
    // Paste
    document.addEventListener('paste', handlePaste);
    
    // Clear all
    elements.clearAllBtn.addEventListener('click', clearAllImages);
    
    // Download all
    elements.downloadAllBtn.addEventListener('click', downloadAllAsZip);
    
    // Resize tabs
    elements.resizeTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.resizeTabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const tab = btn.dataset.tab;
            elements.customTab.classList.toggle('active', tab === 'custom');
            elements.percentageTab.classList.toggle('active', tab === 'percentage');
            elements.presetTab.classList.toggle('active', tab === 'preset');
            
            state.resizeMode = tab;
        });
    });
    
    // Aspect ratio checkbox
    elements.maintainAspectRatio.addEventListener('change', () => {
        if (elements.maintainAspectRatio.checked && elements.widthInput.value) {
            const currentImage = state.images[state.currentImageIndex];
            if (currentImage) {
                const aspectRatio = currentImage.originalWidth / currentImage.originalHeight;
                const newHeight = Math.round(elements.widthInput.value / aspectRatio);
                elements.heightInput.value = newHeight;
            }
        }
    });
    
    // Width input
    elements.widthInput.addEventListener('input', () => {
        if (elements.maintainAspectRatio.checked) {
            const currentImage = state.images[state.currentImageIndex];
            if (currentImage) {
                const aspectRatio = currentImage.originalWidth / currentImage.originalHeight;
                const newHeight = Math.round(elements.widthInput.value / aspectRatio);
                elements.heightInput.value = newHeight;
            }
        }
    });
    
    // Height input
    elements.heightInput.addEventListener('input', () => {
        if (elements.maintainAspectRatio.checked) {
            const currentImage = state.images[state.currentImageIndex];
            if (currentImage) {
                const aspectRatio = currentImage.originalWidth / currentImage.originalHeight;
                const newWidth = Math.round(elements.heightInput.value * aspectRatio);
                elements.widthInput.value = newWidth;
            }
        }
    });
    
    // Percentage buttons
    elements.percentageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.percentageButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const percent = parseInt(btn.dataset.percent);
            const currentImage = state.images[state.currentImageIndex];
            if (currentImage) {
                elements.widthInput.value = Math.round(currentImage.originalWidth * percent / 100);
                elements.heightInput.value = Math.round(currentImage.originalHeight * percent / 100);
            }
        });
    });
    
    // Custom percentage
    elements.customPercentage.addEventListener('change', () => {
        const percent = parseInt(elements.customPercentage.value);
        if (percent > 0) {
            const currentImage = state.images[state.currentImageIndex];
            if (currentImage) {
                elements.widthInput.value = Math.round(currentImage.originalWidth * percent / 100);
                elements.heightInput.value = Math.round(currentImage.originalHeight * percent / 100);
            }
        }
    });
    
    // Preset buttons
    elements.presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const width = parseInt(btn.dataset.width);
            const height = parseInt(btn.dataset.height);
            elements.widthInput.value = width;
            elements.heightInput.value = height;
            
            // Clear percentage selection
            elements.percentageButtons.forEach(b => b.classList.remove('active'));
        });
    });
    
    // Compression mode
    elements.compressionModeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const mode = radio.value;
            elements.qualitySection.style.display = mode === 'quality' ? 'block' : 'none';
            elements.targetSizeSection.style.display = mode === 'targetSize' ? 'block' : 'none';
            state.compressionMode = mode;
        });
    });
    
    // Quality slider
    elements.qualitySlider.addEventListener('input', () => {
        elements.qualityValue.textContent = elements.qualitySlider.value;
    });
    
    // Target size buttons
    elements.targetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const size = parseInt(btn.dataset.size);
            elements.targetSizeInput.value = size;
            elements.targetSizeUnit.value = size >= 1024 ? 'MB' : 'KB';
        });
    });
    
    // Preview mode buttons
    elements.previewModeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.previewModeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.previewMode = btn.dataset.mode;
            
            if (state.processedImages.length > 0) {
                updatePreview();
            }
        });
    });
    
    // Process button
    elements.processBtn.addEventListener('click', processAllImages);
    
    // Reset button
    elements.resetBtn.addEventListener('click', resetForm);
    
    // Download button
    elements.downloadBtn.addEventListener('click', () => downloadImage());
    
    // Keyboard navigation for upload area
    elements.uploadArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            elements.fileInput.click();
        }
    });
    
    // Contact form submission
    elements.contactForm.addEventListener('submit', handleContactFormSubmit);
}

// ============================================
// Contact Form Functions
// ============================================

/**
 * Handle contact form submission
 */
function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const name = elements.contactName.value.trim();
    const email = elements.contactEmail.value.trim();
    const subject = elements.contactSubject.value.trim();
    const message = elements.contactMessage.value.trim();
    
    // Validate inputs
    if (!name || !email || !subject || !message) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Create mailto link with form data
    const recipientEmail = 'krushnatupe11@gmail.com';
    const mailtoSubject = encodeURIComponent(`Contact Form: ${subject}`);
    const mailtoBody = encodeURIComponent(
        `Name: ${name}\n` +
        `Email: ${email}\n\n` +
        `Message:\n${message}`
    );
    
    const mailtoLink = `mailto:${recipientEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    showToast('Opening email client...', 'success');
    
    // Reset form
    elements.contactForm.reset();
}

/**
 * Initialize the application
 */
function init() {
    initTheme();
    initEventListeners();
    
    // Check for browser support
    const canvas = document.createElement('canvas');
    if (!canvas.toBlob) {
        showToast('Your browser may not support advanced image processing', 'warning');
    }
    
    console.log('Image Resizer & Compressor initialized');
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
