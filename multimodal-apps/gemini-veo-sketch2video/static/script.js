document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const imageInput = document.getElementById('imageInput');
    const uploadArea = document.getElementById('uploadArea');
    const previewSection = document.getElementById('previewSection');
    const imagePreview = document.getElementById('imagePreview');
    const canvas = document.getElementById('sketchCanvas');
    const ctx = canvas.getContext('2d');
    const generateButton = document.getElementById('generateButton');
    const loadingDiv = document.getElementById('loading');
    const resultSection = document.getElementById('resultSection');
    const promptInput = document.getElementById('promptInput');
    
    // Canvas control elements
    const drawBtn = document.getElementById('drawBtn');
    const eraseBtn = document.getElementById('eraseBtn');
    const colorPicker = document.getElementById('colorPicker');
    const thicknessSlider = document.getElementById('thicknessSlider');
    const thicknessValue = document.getElementById('thicknessValue');
    const clearCanvasBtn = document.getElementById('clearCanvasBtn');
    
    // Canvas state
    let isDrawing = false;
    let currentMode = 'draw';
    let selectedImageData = null;
    
    // Initialize canvas
    function initializeCanvas() {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        setDrawMode();
    }
    
    // Drawing modes
    function setDrawMode() {
        currentMode = 'draw';
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = thicknessSlider.value;
        canvas.style.cursor = 'crosshair';
        drawBtn.classList.add('active');
        eraseBtn.classList.remove('active');
    }
    
    function setEraseMode() {
        currentMode = 'erase';
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = parseInt(thicknessSlider.value) * 2;
        canvas.style.cursor = 'grab';
        eraseBtn.classList.add('active');
        drawBtn.classList.remove('active');
    }
    
    // Get mouse/touch position
    function getEventPos(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }
    
    // Drawing functions
    function startDrawing(e) {
        e.preventDefault();
        isDrawing = true;
        const pos = getEventPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }
    
    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const pos = getEventPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    }
    
    function stopDrawing() {
        if (isDrawing) {
            isDrawing = false;
            ctx.beginPath();
        }
    }
    
    // Event listeners for canvas
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing, { passive: false });
    
    // Tool controls
    drawBtn.addEventListener('click', setDrawMode);
    eraseBtn.addEventListener('click', setEraseMode);
    
    colorPicker.addEventListener('change', () => {
        if (currentMode === 'draw') {
            ctx.strokeStyle = colorPicker.value;
        }
    });
    
    thicknessSlider.addEventListener('input', () => {
        const value = thicknessSlider.value;
        thicknessValue.textContent = value;
        if (currentMode === 'draw') {
            ctx.lineWidth = value;
        } else {
            ctx.lineWidth = value * 2;
        }
    });
    
    clearCanvasBtn.addEventListener('click', () => {
        initializeCanvas();
        selectedImageData = null;
        previewSection.style.display = 'none';
        resultSection.innerHTML = '';
    });
    
    // File upload handling
    uploadArea.addEventListener('click', () => imageInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            handleImageUpload(files[0]);
        }
    });
    
    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageUpload(e.target.files[0]);
        }
    });
    
    function handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            selectedImageData = e.target.result;
            imagePreview.src = selectedImageData;
            previewSection.style.display = 'block';
            
            // Clear canvas when image is uploaded
            initializeCanvas();
        };
        reader.readAsDataURL(file);
    }
    
    // Generate/Analyze button
    generateButton.addEventListener('click', async function() {
        // Get image data (either from upload or canvas)
        let imageData;
        if (selectedImageData) {
            imageData = selectedImageData;
        } else {
            // Check if canvas has content
            const canvasData = canvas.toDataURL('image/png');
            const blankCanvas = document.createElement('canvas');
            blankCanvas.width = canvas.width;
            blankCanvas.height = canvas.height;
            const blankCtx = blankCanvas.getContext('2d');
            blankCtx.fillStyle = 'white';
            blankCtx.fillRect(0, 0, blankCanvas.width, blankCanvas.height);
            
            if (canvasData === blankCanvas.toDataURL('image/png')) {
                showError('Please upload an image or draw something on the canvas first.');
                return;
            }
            imageData = canvasData;
        }
        
        const prompt = promptInput.value.trim();
        
        // Show loading state
        showLoading(true);
        resultSection.innerHTML = '';
        resultSection.innerHTML = '<div class="loading-video">🎬 Generating image and video... This may take up to 5 minutes.</div>';
        
        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image_data: imageData.split(',')[1], // Remove data:image/jpeg;base64, prefix
                    prompt: prompt
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                if (data.generated_video_url) {
                    showSuccess('Video generated successfully!');
                    displayVideoResult(data);
                } else if (data.message) {
                    showSuccess(data.message);
                    displayResult(data);
                } else {
                    showError('Operation completed but no result received.');
                }
            } else {
                showError(data.error || `Server error: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            showError(`Network error: ${error.message}`);
        } finally {
            showLoading(false);
        }
    });
    
    function showLoading(show) {
        if (show) {
            loadingDiv.style.display = 'block';
            generateButton.disabled = true;
            generateButton.querySelector('.btn-text').style.display = 'none';
            generateButton.querySelector('.btn-loading').style.display = 'inline';
        } else {
            loadingDiv.style.display = 'none';
            generateButton.disabled = false;
            generateButton.querySelector('.btn-text').style.display = 'inline';
            generateButton.querySelector('.btn-loading').style.display = 'none';
        }
    }
    
    function showError(message) {
        resultSection.innerHTML = `<div class="error-message">❌ ${message}</div>`;
    }
    
    function showSuccess(message) {
        resultSection.innerHTML = `<div class="success-message">✅ ${message}</div>`;
    }
    
    function displayResult(data) {
        let resultHtml = '';
        
        if (data.message) {
            resultHtml = `
                <div class="result-content">
                    <div class="info-message">${data.message}</div>
                </div>
            `;
        }
        
        resultSection.innerHTML = resultHtml;
    }

    function displayVideoResult(data) {
        let resultHtml = `
            <div class="result-content">
                <div class="result-header">
                    <h3>🎬 Video Generated Successfully!</h3>
                </div>
                
                <div class="video-container">
                    <video controls preload="metadata" style="max-width: 100%; border-radius: 8px;">
                        <source src="${data.generated_video_url}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
                
                <div class="video-info">
                    <div class="download-section">
                        <a href="${data.generated_video_url}" download class="download-btn">
                            💾 Download Video
                        </a>
                        <a href="${data.generated_video_url}" target="_blank" class="download-btn">
                            🔗 Open in New Tab
                        </a>
                    </div>
                </div>
                
                <div class="info-section">
                    <h4>💡 About This Video</h4>
                    <p>This video was generated using:</p>
                    <ul>
                        <li>🎨 <strong>Gemini</strong> - Converted your sketch to a photorealistic image</li>
                        <li>🎬 <strong>Veo</strong> - Animated the image into a cinematic video</li>
                        <li>⏱️ <strong>Duration:</strong> 8 seconds at 16:9 aspect ratio</li>
                        <li>🔊 <strong>Audio:</strong> AI-generated soundtrack included</li>
                    </ul>
                </div>
            </div>
        `;
        
        resultSection.innerHTML = resultHtml;
    }


    
    // Initialize the app
    initializeCanvas();
}); 