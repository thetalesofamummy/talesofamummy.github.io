// Global variables
let isDarkTheme = false;
let isFullscreen = false;

// Book configuration - UPDATE THESE VALUES
const BOOK_CONFIG = {
    title: "The Tales of a Mummy", // Change this to your book title
    pdfFile: "book.pdf",      // Change this to your PDF filename
    downloadUrl: "book.pdf"   // Change this to your PDF filename for download
};

// DOM elements
const bookSection = document.getElementById('bookSection');
const bookTitle = document.getElementById('bookTitle');
const bookStats = document.getElementById('bookStats');
const pdfContainer = document.getElementById('pdfContainer');
const pdfViewer = document.getElementById('pdfViewer');
const pdfPlaceholder = document.querySelector('.pdf-placeholder');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const themeBtn = document.getElementById('themeBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadUserPreferences();
    loadPDF();
    updateBookInfo();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Control button events
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    themeBtn.addEventListener('click', toggleTheme);
    downloadBtn.addEventListener('click', downloadPDF);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Fullscreen change event
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
}

// Load PDF file
function loadPDF() {
    console.log('Attempting to load PDF:', BOOK_CONFIG.pdfFile);
    
    // For local files, we'll try to show the PDF directly
    // and let the browser handle any errors
    showPDF();
    
    // Add a small delay to check if the PDF loaded successfully
    setTimeout(() => {
        checkPDFStatus();
    }, 2000);
}

// Check if PDF loaded successfully
function checkPDFStatus() {
    try {
        // Try to access the iframe content
        const iframe = document.getElementById('pdfViewer');
        if (iframe && iframe.contentWindow) {
            // If we can access the content window, PDF probably loaded
            console.log('PDF appears to have loaded successfully');
            bookStats.textContent = '';
        } else {
            console.log('PDF may not have loaded properly');
            bookStats.textContent = 'PDF loaded (check if visible)';
        }
    } catch (error) {
        console.log('Could not verify PDF status:', error);
        bookStats.textContent = 'PDF loaded (check if visible)';
    }
}

// Show PDF viewer
function showPDF() {
    console.log('Showing PDF viewer');
    pdfViewer.src = BOOK_CONFIG.pdfFile;
    pdfViewer.style.display = 'block';
    pdfPlaceholder.style.display = 'none';
    bookStats.textContent = 'Loading PDF...';
    
    // Add error handling for the iframe
    pdfViewer.onerror = function() {
        console.log('PDF iframe failed to load');
        showPlaceholder();
    };
    
    // Add load event to confirm PDF loaded
    pdfViewer.onload = function() {
        console.log('PDF iframe loaded successfully');
        bookStats.textContent = 'PDF loaded successfully';
    };
}

// Show placeholder
function showPlaceholder() {
    console.log('Showing placeholder');
    pdfViewer.style.display = 'none';
    pdfPlaceholder.style.display = 'flex';
    bookStats.textContent = 'PDF file not found';
}

// Update book information
function updateBookInfo() {
    bookTitle.textContent = BOOK_CONFIG.title;
}

// Fullscreen controls
function toggleFullscreen() {
    console.log('Toggle fullscreen called, current state:', isFullscreen);
    if (!isFullscreen) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

function enterFullscreen() {
    console.log('Entering fullscreen...');
    
    // Try native fullscreen first
    if (bookSection.requestFullscreen) {
        bookSection.requestFullscreen().catch(err => {
            console.log('Native fullscreen failed:', err);
            enterCSSFullscreen();
        });
    } else if (bookSection.webkitRequestFullscreen) {
        bookSection.webkitRequestFullscreen().catch(err => {
            console.log('Webkit fullscreen failed:', err);
            enterCSSFullscreen();
        });
    } else if (bookSection.mozRequestFullScreen) {
        bookSection.mozRequestFullScreen().catch(err => {
            console.log('Mozilla fullscreen failed:', err);
            enterCSSFullscreen();
        });
    } else if (bookSection.msRequestFullscreen) {
        bookSection.msRequestFullscreen().catch(err => {
            console.log('MS fullscreen failed:', err);
            enterCSSFullscreen();
        });
    } else {
        console.log('No native fullscreen support, using CSS fallback');
        enterCSSFullscreen();
    }
}

function exitFullscreen() {
    console.log('Exiting fullscreen...');
    
    // Try native fullscreen exit first
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else {
        console.log('No native fullscreen exit support, using CSS fallback');
        exitCSSFullscreen();
    }
}

// Debug function to check fullscreen dimensions
function debugFullscreen() {
    console.log('=== Fullscreen Debug ===');
    
    const bookSection = document.getElementById('bookSection');
    const bookContent = document.querySelector('.book-content');
    const pdfContainer = document.querySelector('.pdf-container');
    const pdfViewer = document.getElementById('pdfViewer');
    
    console.log('Window dimensions:', window.innerWidth, 'x', window.innerHeight);
    console.log('Book section:', bookSection.offsetWidth, 'x', bookSection.offsetHeight);
    console.log('Book content:', bookContent.offsetWidth, 'x', bookContent.offsetHeight);
    console.log('PDF container:', pdfContainer.offsetWidth, 'x', pdfContainer.offsetHeight);
    console.log('PDF viewer:', pdfViewer.offsetWidth, 'x', pdfViewer.offsetHeight);
    
    console.log('Book section styles:');
    console.log('- position:', bookSection.style.position);
    console.log('- width:', bookSection.style.width);
    console.log('- height:', bookSection.style.height);
    console.log('- display:', bookSection.style.display);
    
    console.log('PDF viewer styles:');
    console.log('- width:', pdfViewer.style.width);
    console.log('- height:', pdfViewer.style.height);
    console.log('- flex:', pdfViewer.style.flex);
    
    // Calculate expected vs actual
    const expectedHeight = window.innerHeight - 60; // minus header
    const actualHeight = bookContent.offsetHeight;
    console.log('Expected content height:', expectedHeight);
    console.log('Actual content height:', actualHeight);
    console.log('Difference:', expectedHeight - actualHeight);
}

// Add debug call to fullscreen function
function enterCSSFullscreen() {
    console.log('Entering CSS fullscreen...');
    
    // Add classes
    bookSection.classList.add('fullscreen');
    document.body.classList.add('fullscreen-active');
    
    // Apply aggressive styling
    applyAggressiveFullscreenStyles();
    
    // Hide header and footer
    const header = document.querySelector('.header');
    const footer = document.querySelector('.footer');
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    
    // Force body to not scroll
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    
    // Update state
    isFullscreen = true;
    updateFullscreenButton();
    
    // Focus for keyboard handling
    bookSection.focus();
    
    console.log('CSS fullscreen applied');
    
    // Debug after a short delay to let styles apply
    setTimeout(debugFullscreen, 100);
}

function exitCSSFullscreen() {
    console.log('Exiting CSS fullscreen...');
    
    // Remove classes
    bookSection.classList.remove('fullscreen');
    document.body.classList.remove('fullscreen-active');
    
    // Remove aggressive styling
    removeAggressiveFullscreenStyles();
    
    // Show header and footer
    const header = document.querySelector('.header');
    const footer = document.querySelector('.footer');
    if (header) header.style.display = '';
    if (footer) footer.style.display = '';
    
    // Restore body styles
    document.body.style.overflow = '';
    document.body.style.height = '';
    
    // Update state
    isFullscreen = false;
    updateFullscreenButton();
    
    console.log('CSS fullscreen removed');
}

function handleFullscreenChange() {
    const isInFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
    
    console.log('Fullscreen change detected:', isInFullscreen);
    
    if (isInFullscreen !== isFullscreen) {
        isFullscreen = isInFullscreen;
        updateFullscreenButton();
        
        if (isFullscreen) {
            console.log('Native fullscreen entered, applying aggressive styling...');
            // Apply aggressive styling even for native fullscreen
            applyAggressiveFullscreenStyles();
            // Hide header and footer for native fullscreen
            const header = document.querySelector('.header');
            const footer = document.querySelector('.footer');
            if (header) header.style.display = 'none';
            if (footer) footer.style.display = 'none';
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh';
            
            // Debug after a short delay
            setTimeout(debugFullscreen, 100);
        } else {
            console.log('Native fullscreen exited, removing aggressive styling...');
            // Remove aggressive styling
            removeAggressiveFullscreenStyles();
            // Show header and footer
            const header = document.querySelector('.header');
            const footer = document.querySelector('.footer');
            if (header) header.style.display = '';
            if (footer) footer.style.display = '';
            document.body.style.overflow = '';
            document.body.style.height = '';
        }
    }
}

// Function to apply aggressive fullscreen styles
function applyAggressiveFullscreenStyles() {
    console.log('Applying aggressive fullscreen styles...');
    
    // Set aggressive inline styles
    bookSection.style.position = 'fixed';
    bookSection.style.top = '0';
    bookSection.style.left = '0';
    bookSection.style.width = '100vw';
    bookSection.style.height = '100vh';
    bookSection.style.zIndex = '9999';
    bookSection.style.margin = '0';
    bookSection.style.padding = '0';
    bookSection.style.borderRadius = '0';
    bookSection.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
    bookSection.style.display = 'flex';
    bookSection.style.flexDirection = 'column';
    bookSection.style.overflow = 'hidden';
    
    if (isDarkTheme) {
        bookSection.style.backgroundColor = 'rgba(44, 62, 80, 0.98)';
    }
    
    // Hide the book header completely in fullscreen
    const bookHeader = document.querySelector('.book-header');
    if (bookHeader) {
        bookHeader.style.display = 'none';
    }
    
    // Set book content to fill entire screen
    const bookContent = document.querySelector('.book-content');
    if (bookContent) {
        bookContent.style.flex = '1';
        bookContent.style.height = '100vh';
        bookContent.style.padding = '0';
        bookContent.style.margin = '0';
        bookContent.style.display = 'flex';
        bookContent.style.flexDirection = 'column';
        bookContent.style.overflow = 'hidden';
    }
    
    // Set PDF container to fill all space
    const pdfContainer = document.querySelector('.pdf-container');
    if (pdfContainer) {
        pdfContainer.style.flex = '1';
        pdfContainer.style.height = '100%';
        pdfContainer.style.borderRadius = '0';
        pdfContainer.style.display = 'flex';
        pdfContainer.style.flexDirection = 'column';
        pdfContainer.style.overflow = 'hidden';
    }
    
    // Set PDF viewer to fill entire container
    const pdfViewer = document.getElementById('pdfViewer');
    if (pdfViewer) {
        pdfViewer.style.flex = '1';
        pdfViewer.style.width = '100%';
        pdfViewer.style.height = '100%';
        pdfViewer.style.borderRadius = '0';
        pdfViewer.style.border = 'none';
        pdfViewer.style.minHeight = '0';
    }
}

// Function to remove aggressive fullscreen styles
function removeAggressiveFullscreenStyles() {
    console.log('Removing aggressive fullscreen styles...');
    
    // Remove all inline styles
    bookSection.style.position = '';
    bookSection.style.top = '';
    bookSection.style.left = '';
    bookSection.style.width = '';
    bookSection.style.height = '';
    bookSection.style.zIndex = '';
    bookSection.style.margin = '';
    bookSection.style.padding = '';
    bookSection.style.borderRadius = '';
    bookSection.style.backgroundColor = '';
    bookSection.style.display = '';
    bookSection.style.flexDirection = '';
    bookSection.style.overflow = '';
    
    // Restore book header
    const bookHeader = document.querySelector('.book-header');
    if (bookHeader) {
        bookHeader.style.display = '';
    }
    
    // Reset book content styles
    const bookContent = document.querySelector('.book-content');
    if (bookContent) {
        bookContent.style.flex = '';
        bookContent.style.height = '';
        bookContent.style.padding = '';
        bookContent.style.margin = '';
        bookContent.style.display = '';
        bookContent.style.flexDirection = '';
        bookContent.style.overflow = '';
    }
    
    // Reset PDF container styles
    const pdfContainer = document.querySelector('.pdf-container');
    if (pdfContainer) {
        pdfContainer.style.flex = '';
        pdfContainer.style.height = '';
        pdfContainer.style.borderRadius = '';
        pdfContainer.style.display = '';
        pdfContainer.style.flexDirection = '';
        pdfContainer.style.overflow = '';
    }
    
    // Reset PDF viewer styles
    const pdfViewer = document.getElementById('pdfViewer');
    if (pdfViewer) {
        pdfViewer.style.flex = '';
        pdfViewer.style.width = '';
        pdfViewer.style.height = '';
        pdfViewer.style.borderRadius = '';
        pdfViewer.style.border = '';
        pdfViewer.style.minHeight = '';
    }
}

function updateFullscreenButton() {
    if (isFullscreen) {
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        fullscreenBtn.title = 'Exit fullscreen';
    } else {
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        fullscreenBtn.title = 'Toggle fullscreen';
    }
}

// Theme controls
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
        themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        themeBtn.title = 'Switch to light theme';
    } else {
        document.body.classList.remove('dark-theme');
        themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        themeBtn.title = 'Switch to dark theme';
    }
    
    // Save preference
    localStorage.setItem('darkTheme', isDarkTheme);
}

// Download functionality
function downloadPDF() {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = BOOK_CONFIG.downloadUrl;
    link.download = BOOK_CONFIG.pdfFile;
    link.target = '_blank';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Download started!', 'success');
}

// Keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // F11 or F for fullscreen
    if (e.key === 'F11' || e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
    }
    
    // T for theme toggle
    if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        toggleTheme();
    }
    
    // D for download
    if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        downloadPDF();
    }
    
    // Escape to exit fullscreen
    if (e.key === 'Escape' && isFullscreen) {
        exitFullscreen();
    }
}

// Notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        info: '#3498db'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Load user preferences
function loadUserPreferences() {
    // Load theme preference
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
        isDarkTheme = true;
        document.body.classList.add('dark-theme');
        themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        themeBtn.title = 'Switch to light theme';
    }
}

// Add helpful instructions to the placeholder
function updatePlaceholderInstructions() {
    const instructions = document.querySelector('.pdf-instructions');
    if (instructions) {
        instructions.innerHTML = `
            To add your PDF book:<br>
            1. Place your PDF file in the same folder as this website<br>
            2. Rename it to "${BOOK_CONFIG.pdfFile}"<br>
            3. Update the book title in script.js (currently: "${BOOK_CONFIG.title}")<br>
            4. Refresh this page
        `;
    }
}

// Initialize placeholder instructions
document.addEventListener('DOMContentLoaded', function() {
    updatePlaceholderInstructions();
});

// Test PDF file function
function testPDFFile() {
    console.log('=== PDF File Test ===');
    console.log('Looking for file:', BOOK_CONFIG.pdfFile);
    
    // Clear any previous test results
    const existingResult = document.querySelector('.test-result');
    if (existingResult) {
        existingResult.remove();
    }
    
    // Create result display
    const resultDiv = document.createElement('div');
    resultDiv.className = 'test-result';
    resultDiv.style.cssText = `
        margin-top: 20px;
        padding: 15px;
        border-radius: 10px;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        font-family: monospace;
        font-size: 0.9rem;
        max-width: 500px;
        word-wrap: break-word;
    `;
    
    resultDiv.innerHTML = '<strong>PDF File Test Results:</strong><br>';
    resultDiv.innerHTML += `📁 Looking for: ${BOOK_CONFIG.pdfFile}<br>`;
    resultDiv.innerHTML += `🌐 Current protocol: ${window.location.protocol}<br>`;
    
    if (window.location.protocol === 'file:') {
        resultDiv.innerHTML += '⚠️ Running from local file system<br>';
        resultDiv.innerHTML += '💡 Some features may be limited due to browser security<br>';
        resultDiv.innerHTML += '💡 For best results, use a local server<br>';
        resultDiv.innerHTML += '<br><strong>Solutions:</strong><br>';
        resultDiv.innerHTML += '1. Use Python: python -m http.server 8000<br>';
        resultDiv.innerHTML += '2. Use Node.js: npx http-server<br>';
        resultDiv.innerHTML += '3. Use VS Code Live Server extension<br>';
    } else {
        resultDiv.innerHTML += '✅ Running from web server<br>';
    }
    
    resultDiv.innerHTML += '<br><strong>Current Status:</strong><br>';
    resultDiv.innerHTML += '🔄 Attempting to load PDF...<br>';
    
    // Try to load the PDF
    const testIframe = document.createElement('iframe');
    testIframe.style.display = 'none';
    testIframe.src = BOOK_CONFIG.pdfFile;
    
    testIframe.onload = function() {
        resultDiv.innerHTML += '✅ PDF file found and loaded!<br>';
        resultDiv.innerHTML += '🎉 Your PDF should be visible now<br>';
    };
    
    testIframe.onerror = function() {
        resultDiv.innerHTML += '❌ PDF file could not be loaded<br>';
        resultDiv.innerHTML += '💡 Check that the file exists and is named correctly<br>';
    };
    
    // Add test iframe to page temporarily
    document.body.appendChild(testIframe);
    
    // Remove test iframe after a delay
    setTimeout(() => {
        if (document.body.contains(testIframe)) {
            document.body.removeChild(testIframe);
        }
    }, 3000);
    
    // Add result to placeholder
    const placeholder = document.querySelector('.pdf-placeholder');
    placeholder.appendChild(resultDiv);
    
    console.log('Test completed. Check the page for results.');
} 