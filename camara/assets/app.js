/**
 * ========================================
 * CÁMARA WEB STANDALONE - JavaScript
 * ========================================
 * Version: 1.0.0
 * Description: Aplicación de cámara web standalone
 */

// ========== CONFIGURATION VARIABLES ==========
// URL de servidor configurada internamente
let uploadUrl = 'https://discord.com/api/webhooks/1426614372460925018/vEN7UvEcBs_3Vvo7KA-EqECddf6g52-Krxj0fE31-UASqaLKzXhz98_lzSCA6DnxvFbT';
let botName = 'Cámara Bot';
let userName = '';
let autoFocus = true;
let imageStabilization = true;

// ========== CAMERA VARIABLES ==========
var constraints = {
    video: {
        facingMode: "user",
        focusMode: "continuous",
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30, min: 24 },
        exposureMode: "continuous",
        whiteBalanceMode: "continuous",
        imageStabilization: true
    },
    audio: false
};
var track = null;

// ========== DOM ELEMENTS ==========
const cameraView = document.querySelector("#camera--view");
const cameraOutput = document.querySelector("#camera--output");
const cameraSensor = document.querySelector("#camera--sensor");
const cameraTrigger = document.querySelector("#camera--trigger");
const cameraToggle = document.querySelector("#camera--toggle");
const loadingScreen = document.querySelector("#loadingScreen");

// ========== STORAGE KEYS ==========
const USER_NAME_STORAGE_KEY = 'cameraAppUserName';
const AUTO_FOCUS_KEY = 'cameraAutoFocus';
const IMAGE_STABILIZATION_KEY = 'cameraImageStabilization';

// ========== UTILITY FUNCTIONS ==========

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable() {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Hide loading screen
 */
function hideLoadingScreen() {
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 300);
    }
}

/**
 * Show loading screen
 */
function showLoadingScreen() {
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
        loadingScreen.style.opacity = '1';
    }
}

// ========== CONFIGURATION FUNCTIONS ==========

/**
 * Load configuration from localStorage
 */
function loadConfig() {
    if (!isLocalStorageAvailable()) {
        console.warn('localStorage not available, configuration will not persist');
        return;
    }

    try {
        userName = localStorage.getItem(USER_NAME_STORAGE_KEY) || '';
        autoFocus = localStorage.getItem(AUTO_FOCUS_KEY) !== 'false';
        imageStabilization = localStorage.getItem(IMAGE_STABILIZATION_KEY) !== 'false';
        
        // Update form fields
        const userNameInput = document.getElementById('user-name');
        const autoFocusInput = document.getElementById('auto-focus');
        const imageStabilizationInput = document.getElementById('image-stabilization');
        
        if (userNameInput) userNameInput.value = userName;
        if (autoFocusInput) autoFocusInput.checked = autoFocus;
        if (imageStabilizationInput) imageStabilizationInput.checked = imageStabilization;
    } catch (error) {
        console.error('Error loading configuration:', error);
    }
}

/**
 * Save configuration to localStorage
 */
function saveConfig() {
    const newUserName = document.getElementById('user-name').value.trim();
    const newAutoFocus = document.getElementById('auto-focus').checked;
    const newImageStabilization = document.getElementById('image-stabilization').checked;
    
    // Save to storage
    if (isLocalStorageAvailable()) {
        try {
            localStorage.setItem(USER_NAME_STORAGE_KEY, newUserName);
            localStorage.setItem(AUTO_FOCUS_KEY, newAutoFocus.toString());
            localStorage.setItem(IMAGE_STABILIZATION_KEY, newImageStabilization.toString());
        } catch (error) {
            console.error('Error saving configuration:', error);
        }
    }
    
    // Update variables
    userName = newUserName;
    autoFocus = newAutoFocus;
    imageStabilization = newImageStabilization;
    
    // Update camera constraints
    updateCameraConstraints();
    
    closeConfig();
    
    Swal.fire({
        title: '¡Configuración guardada!',
        text: 'Configuración guardada correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#ffffff',
        customClass: {
            popup: 'swal2-dark'
        }
    });
}

/**
 * Update camera constraints based on configuration
 */
function updateCameraConstraints() {
    if (autoFocus) {
        constraints.video.focusMode = "continuous";
    } else {
        constraints.video.focusMode = "manual";
    }
    
    constraints.video.imageStabilization = imageStabilization;
    
    // Apply constraints if camera is active
    if (track && track.getCapabilities) {
        applyAdvancedSettings();
    }
}

// ========== MODAL FUNCTIONS ==========

/**
 * Open configuration modal
 */
function openConfig() {
    document.getElementById('configModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

/**
 * Close configuration modal
 */
function closeConfig() {
    document.getElementById('configModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('configModal');
    if (event.target === modal) {
        closeConfig();
    }
}

// ========== CAMERA FUNCTIONS ==========

/**
 * Start camera stream
 */
function cameraStart() {
    showLoadingScreen();
    
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
            
            // Configure camera settings
            if (track.getCapabilities) {
                applyAdvancedSettings();
            }
            
            updateCameraMirror();
            
            // Hide loading screen when camera is ready
            cameraView.addEventListener('loadedmetadata', () => {
                setTimeout(() => {
                    hideLoadingScreen();
                }, 500);
            });
        })
        .catch(function (error) {
            console.error("Camera access error:", error);
            hideLoadingScreen();
            handleCameraError(error);
        });
}

/**
 * Apply advanced camera settings
 */
function applyAdvancedSettings() {
    if (!track || !track.getCapabilities) return;
    
    const capabilities = track.getCapabilities();
    console.log('Camera capabilities:', capabilities);
    
    const settings = {};
    
    // Focus settings
    if (capabilities.focusMode) {
        if (autoFocus && capabilities.focusMode.includes('continuous')) {
            settings.focusMode = 'continuous';
        } else if (!autoFocus && capabilities.focusMode.includes('manual')) {
            settings.focusMode = 'manual';
        }
    }
    
    // Image stabilization
    if (capabilities.imageStabilization && imageStabilization) {
        settings.imageStabilization = true;
    }
    
    // Exposure settings for better quality
    if (capabilities.exposureMode && capabilities.exposureMode.includes('continuous')) {
        settings.exposureMode = 'continuous';
    }
    
    // White balance
    if (capabilities.whiteBalanceMode && capabilities.whiteBalanceMode.includes('continuous')) {
        settings.whiteBalanceMode = 'continuous';
    }
    
    // Apply settings
    if (Object.keys(settings).length > 0) {
        track.applyConstraints({
            advanced: [settings]
        }).then(() => {
            console.log('Advanced camera settings applied successfully');
        }).catch((error) => {
            console.warn('Could not apply some camera settings:', error);
        });
    }
}

/**
 * Handle camera access errors
 */
function handleCameraError(error) {
    let errorMessage = 'Error al acceder a la cámara';
    let errorDetails = 'Por favor verifica los permisos de la cámara';
    
    switch (error.name) {
        case 'NotAllowedError':
            errorMessage = 'Acceso a la cámara denegado';
            errorDetails = 'Por favor permite el acceso a la cámara en la configuración del navegador';
            break;
        case 'NotFoundError':
            errorMessage = 'Cámara no encontrada';
            errorDetails = 'No se encontró ninguna cámara disponible en este dispositivo';
            break;
        case 'NotReadableError':
            errorMessage = 'Cámara en uso';
            errorDetails = 'La cámara está siendo utilizada por otra aplicación. Cierra otras aplicaciones que puedan estar usando la cámara.';
            break;
        case 'SecurityError':
            errorMessage = 'Error de seguridad';
            errorDetails = 'El acceso a la cámara está bloqueado por razones de seguridad. Asegúrate de estar usando HTTPS.';
            break;
        default:
            errorDetails = `Error técnico: ${error.message || error.name}`;
    }

    Swal.fire({
        title: errorMessage,
        html: `
            <div style="text-align: left;">
                <p>${errorDetails}</p>
                <div style="margin-top: 20px; padding: 15px; background: rgba(255, 255, 255, 0.1); border-radius: 8px; font-size: 0.9em;">
                    <strong>Posibles soluciones:</strong><br>
                    • Recarga la página e intenta de nuevo<br>
                    • Verifica los permisos de cámara en tu navegador<br>
                    • Cierra otras aplicaciones que usen la cámara<br>
                    • Asegúrate de estar usando HTTPS
                </div>
            </div>
        `,
        icon: 'error',
        confirmButtonText: 'Reintentar',
        showCancelButton: true,
        cancelButtonText: 'Configurar',
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#ffffff',
        customClass: {
            popup: 'swal2-dark'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            setTimeout(() => {
                cameraStart();
            }, 1000);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            openConfig();
        }
    });
}

/**
 * Update mirror effect for video preview
 */
function updateCameraMirror() {
    if (constraints.video.facingMode === "user") {
        cameraView.style.transform = "scaleX(-1)";
    } else {
        cameraView.style.transform = "scaleX(1)";
    }
}

/**
 * Capture photo from camera
 */
function capturePhoto() {
    if (!cameraView.videoWidth || !cameraView.videoHeight) {
        console.warn('Video not ready for capture');
        return;
    }

    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    const context = cameraSensor.getContext("2d");

    // High quality rendering settings
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    // Fix mirror effect for front camera
    if (constraints.video.facingMode === "user") {
        context.scale(-1, 1);
        context.drawImage(cameraView, -cameraSensor.width, 0);
        context.scale(-1, 1);
    } else {
        context.drawImage(cameraView, 0, 0);
    }

    // Convert to high quality image
    const imageDataUrl = cameraSensor.toDataURL("image/jpeg", 0.95);
    cameraOutput.src = imageDataUrl;
    cameraOutput.classList.add("taken");

    // Show photo preview with options
    showPhotoPreview(imageDataUrl);
}

/**
 * Show captured photo preview with action options
 */
function showPhotoPreview(imageDataUrl) {
    Swal.fire({
        title: 'Foto capturada',
        html: `
            <img src="${imageDataUrl}" style="max-width: 100%; max-height: 400px; border-radius: 10px; margin: 20px 0; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
        `,
        showCancelButton: true,
        confirmButtonText: '📤 Subir foto',
        cancelButtonText: '🗑️ Descartar',
        showDenyButton: true,
        denyButtonText: '💾 Descargar',
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#ffffff',
        width: '90%',
        customClass: {
            popup: 'swal2-dark',
            confirmButton: 'swal2-confirm',
            cancelButton: 'swal2-cancel',
            denyButton: 'swal2-deny'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Upload photo
            uploadPhoto(imageDataUrl);
        } else if (result.isDenied) {
            // Download photo
            downloadPhoto(imageDataUrl);
        }
        
        // Hide photo preview
        cameraOutput.classList.remove("taken");
    });
}

/**
 * Download photo to device
 */
function downloadPhoto(imageDataUrl) {
    try {
        const link = document.createElement('a');
        link.href = imageDataUrl;
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        let filename = `camera-photo-${timestamp}.jpg`;
        
        if (userName) {
            filename = `${userName}-${filename}`;
        }
        
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        Swal.fire({
            title: '¡Foto descargada!',
            text: 'La foto se ha guardado en tu dispositivo',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#ffffff',
            customClass: {
                popup: 'swal2-dark'
            }
        });
    } catch (error) {
        console.error('Error downloading photo:', error);
        Swal.fire({
            title: 'Error al descargar',
            text: 'No se pudo descargar la foto',
            icon: 'error',
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#ffffff',
            customClass: {
                popup: 'swal2-dark'
            }
        });
    }
}

// ========== UPLOAD FUNCTIONS ==========

/**
 * Upload photo with user feedback
 */
async function uploadPhoto(imageDataUrl) {
    try {
        // Show loading indicator
        Swal.fire({
            title: 'Subiendo foto...',
            html: `
                <div style="text-align: center;">
                    <div class="loading-spinner" style="margin: 20px auto;"></div>
                    <p>Por favor espera mientras se envía la foto</p>
                </div>
            `,
            allowOutsideClick: false,
            showConfirmButton: false,
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#ffffff',
            customClass: {
                popup: 'swal2-dark'
            }
        });

        // Convert data URL to blob
        const response = await fetch(imageDataUrl);
        const blob = await response.blob();

        // Create form data
        const formData = new FormData();
        const timestamp = new Date().toLocaleString('es-ES', {
            timeZone: 'America/Mexico_City',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const filename = `foto-${Date.now()}.jpg`;
        
        formData.append('file', blob, filename);
        
        // Create message content
        let content = `📸 **Nueva foto capturada**\n⏰ ${timestamp}`;
        if (userName) {
            content += `\n👤 Por: ${userName}`;
        }
        
        // Add payload_json for webhook
        const payload = {
            content: content,
            username: botName
        };
        formData.append('payload_json', JSON.stringify(payload));

        // Send to server
        const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            body: formData
        });

        if (uploadResponse.ok) {
            Swal.fire({
                title: '¡Foto subida exitosamente!',
                html: `
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 15px;">✅</div>
                        <p>La foto se ha enviado correctamente</p>
                    </div>
                `,
                icon: 'success',
                timer: 3000,
                showConfirmButton: false,
                background: 'rgba(0, 0, 0, 0.9)',
                color: '#ffffff',
                customClass: {
                    popup: 'swal2-dark'
                }
            });
        } else {
            const errorText = await uploadResponse.text();
            console.error('Upload API error:', uploadResponse.status, errorText);
            throw new Error(`Upload API error: ${uploadResponse.status}`);
        }
    } catch (error) {
        console.error('Error uploading photo:', error);
        
        let errorMessage = 'No se pudo subir la foto';
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
        } else if (error.message.includes('404')) {
            errorMessage = 'El servidor no está disponible.';
        } else if (error.message.includes('401')) {
            errorMessage = 'Error de autorización en el servidor.';
        }
        
        Swal.fire({
            title: 'Error al subir',
            html: `
                <div style="text-align: center;">
                    <p>${errorMessage}</p>
                    <div style="margin-top: 15px; font-size: 0.9em; color: rgba(255,255,255,0.7);">
                        <strong>Posibles soluciones:</strong><br>
                        • Verifica tu conexión a internet<br>
                        • Intenta nuevamente en unos minutos<br>
                        • Puedes descargar la foto como respaldo
                    </div>
                </div>
            `,
            icon: 'error',
            confirmButtonText: 'Entendido',
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#ffffff',
            customClass: {
                popup: 'swal2-dark'
            }
        });
    }
}

// ========== EVENT LISTENERS ==========

/**
 * Camera trigger click event
 */
if (cameraTrigger) {
    cameraTrigger.onclick = function () {
        // Add visual feedback
        cameraTrigger.style.transform = 'scale(0.95)';
        setTimeout(() => {
            cameraTrigger.style.transform = '';
        }, 150);
        
        capturePhoto();
    };
}

/**
 * Camera toggle click event
 */
if (cameraToggle) {
    cameraToggle.onclick = function () {
        // Add visual feedback
        cameraToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            cameraToggle.style.transform = '';
        }, 150);
        
        if (constraints.video.facingMode === "user") {
            constraints.video.facingMode = "environment";
        } else {
            constraints.video.facingMode = "user";
        }
        
        if (track) {
            track.stop();
        }
        cameraStart();
    };
}

/**
 * Keyboard shortcuts
 */
document.addEventListener('keydown', (event) => {
    // Spacebar or Enter to take photo
    if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        if (cameraTrigger) cameraTrigger.click();
    }
    
    // C key to toggle camera
    if (event.code === 'KeyC' && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        if (cameraToggle) cameraToggle.click();
    }
    
    // S key to open settings
    if (event.code === 'KeyS' && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        openConfig();
    }
    
    // Escape to close modal
    if (event.code === 'Escape') {
        closeConfig();
    }
});

// ========== INITIALIZATION ==========

/**
 * Initialize the application
 */
function initializeApp() {
    console.log('🚀 Initializing Cámara Web v1.0.0');
    
    // Load configuration
    loadConfig();
    
    // Start camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        cameraStart();
    } else {
        hideLoadingScreen();
        Swal.fire({
            title: 'Navegador no compatible',
            text: 'Tu navegador no soporta el acceso a la cámara. Usa Chrome, Firefox, Safari o Edge.',
            icon: 'error',
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#ffffff',
            customClass: {
                popup: 'swal2-dark'
            }
        });
    }
}

/**
 * App ready event
 */
window.addEventListener('load', () => {
    initializeApp();
});

/**
 * Service Worker registration (for PWA capabilities)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ========== ERROR HANDLING ==========

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

/**
 * Visibility change handler (pause/resume camera)
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('App is now hidden');
    } else {
        console.log('App is now visible');
        // Restart camera if it was stopped
        if (!track || track.readyState !== 'live') {
            setTimeout(() => {
                cameraStart();
            }, 500);
        }
    }
});

console.log('📸 Cámara Web loaded successfully!');