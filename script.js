// Hong Kong Interactive Map JavaScript

// Hong Kong coordinates (approximate center)
const HONG_KONG_CENTER = { lat: 22.396428, lng: 114.109497 };
let currentZoom = 10;
let currentCenter = { ...HONG_KONG_CENTER };

// Tile bounds for Hong Kong Government tiles (only available at zoom 12-13)
const HK_TILE_BOUNDS = {
    12: {
        x: { min: 767, max: 772 },
        y: { 771: { min: 571, max: 579 } }
    },
    13: {
        x: { min: 1534, max: 1544 },
        y: { 1534: { min: 1142, max: 1158 } }
    }
};

// Map configuration
const MIN_ZOOM = 1;
const MAX_ZOOM = 18;
const TILES_PER_ROW = 4;
const TILES_PER_COL = 3;

// Map state
let mapElement;
let mapGrid;
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let mapOffset = { x: 0, y: 0 };

function initializeMap() {
    console.log('Initializing Hong Kong Interactive Map...');
    
    mapElement = document.getElementById('map');
    mapGrid = document.getElementById('mapGrid');
    
    // Setup map interactions
    setupMapControls();
    setupMapDragging();
    
    // Initial render
    updateMapView();
    updateCoordinateDisplay();
    
    // Setup tile grid
    createTileGrid();
}

function setupMapControls() {
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    
    zoomInBtn.addEventListener('click', () => {
        if (currentZoom < MAX_ZOOM) {
            currentZoom++;
            updateMapView();
        }
    });
    
    zoomOutBtn.addEventListener('click', () => {
        if (currentZoom > MIN_ZOOM) {
            currentZoom--;
            updateMapView();
        }
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === '+' || e.key === '=') {
            if (currentZoom < MAX_ZOOM) {
                currentZoom++;
                updateMapView();
            }
        } else if (e.key === '-') {
            if (currentZoom > MIN_ZOOM) {
                currentZoom--;
                updateMapView();
            }
        }
    });
}

function setupMapDragging() {
    mapElement.addEventListener('mousedown', startDrag);
    mapElement.addEventListener('mousemove', drag);
    mapElement.addEventListener('mouseup', endDrag);
    mapElement.addEventListener('mouseleave', endDrag);
    
    // Touch events for mobile
    mapElement.addEventListener('touchstart', startDrag);
    mapElement.addEventListener('touchmove', drag);
    mapElement.addEventListener('touchend', endDrag);
}

function startDrag(e) {
    isDragging = true;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    dragStart = { x: clientX, y: clientY };
    mapElement.style.cursor = 'grabbing';
    
    if (e.preventDefault) e.preventDefault();
}

function drag(e) {
    if (!isDragging) return;
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    
    mapOffset.x += deltaX * 0.001; // Scale down movement
    mapOffset.y += deltaY * 0.001;
    
    dragStart = { x: clientX, y: clientY };
    
    // Update center based on drag
    currentCenter.lng += deltaX * 0.0001;
    currentCenter.lat -= deltaY * 0.0001;
    
    updateCoordinateDisplay();
    
    if (e.preventDefault) e.preventDefault();
}

function endDrag() {
    isDragging = false;
    mapElement.style.cursor = 'grab';
}

function createTileGrid() {
    mapGrid.innerHTML = '';
    
    mapGrid.style.gridTemplateColumns = `repeat(${TILES_PER_ROW}, 1fr)`;
    mapGrid.style.gridTemplateRows = `repeat(${TILES_PER_COL}, 1fr)`;
    
    // Calculate center tile coordinates for current view
    const centerTile = latLngToTile(currentCenter.lat, currentCenter.lng, currentZoom);
    
    for (let row = 0; row < TILES_PER_COL; row++) {
        for (let col = 0; col < TILES_PER_ROW; col++) {
            const tileX = centerTile.x - Math.floor(TILES_PER_ROW / 2) + col;
            const tileY = centerTile.y - Math.floor(TILES_PER_COL / 2) + row;
            
            createTile(tileX, tileY, currentZoom);
        }
    }
}

function createTile(x, y, z) {
    const tile = document.createElement('div');
    tile.className = 'tile loading';
    
    const label = document.createElement('div');
    label.className = 'tile-label';
    label.textContent = `${z}/${x}/${y}`;
    tile.appendChild(label);
    
    // Determine which tile service to use
    let tileUrl;
    let isHKTile = false;
    
    // Check if we can use HK Government tiles
    if (isValidHKTile(z, x, y)) {
        tileUrl = `https://services2.map.gov.hk/ib20000/tile/${z}/${x}/${y}?blankTile=false`;
        isHKTile = true;
        tile.classList.add('hk-tile');
    } else {
        // Use OpenStreetMap as fallback
        tileUrl = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
        tile.classList.add('osm-tile');
    }
    
    // Try to load the tile image
    const img = new Image();
    img.onload = () => {
        tile.style.backgroundImage = `url(${tileUrl})`;
        tile.classList.remove('loading');
        tile.classList.add('loaded');
        label.style.display = 'none';
        
        // Add attribution overlay
        if (!isHKTile) {
            const attribution = document.createElement('div');
            attribution.className = 'tile-attribution';
            attribution.textContent = 'OSM';
            tile.appendChild(attribution);
        }
    };
    img.onerror = () => {
        tile.classList.remove('loading');
        tile.classList.add('error');
        label.textContent = `${z}/${x}/${y} (unavailable)`;
    };
    
    // Add crossorigin for external tiles
    if (!isHKTile) {
        img.crossOrigin = 'anonymous';
    }
    
    img.src = tileUrl;
    mapGrid.appendChild(tile);
}

function updateMapView() {
    createTileGrid();
    updateCoordinateDisplay();
}

function updateCoordinateDisplay() {
    document.getElementById('zoom').textContent = currentZoom;
    document.getElementById('center').textContent = 
        `${currentCenter.lat.toFixed(4)}, ${currentCenter.lng.toFixed(4)}`;
    
    const centerTile = latLngToTile(currentCenter.lat, currentCenter.lng, currentZoom);
    document.getElementById('tileCoords').textContent = 
        `${currentZoom}/${centerTile.x}/${centerTile.y}`;
    
    // Update zoom level display
    const zoomDisplay = document.getElementById('zoomLevels');
    if (zoomDisplay) {
        const hkAvailable = (currentZoom === 12 || currentZoom === 13);
        zoomDisplay.textContent = hkAvailable ? 
            `1-${MAX_ZOOM} (HK Gov tiles available at current zoom)` : 
            `1-${MAX_ZOOM} (Using OpenStreetMap at current zoom)`;
    }
}

// Utility function to check if a tile is valid for Hong Kong Government service
function isValidHKTile(z, x, y) {
    if (!HK_TILE_BOUNDS[z]) return false;
    
    const bounds = HK_TILE_BOUNDS[z];
    
    // Check X bounds
    if (x < bounds.x.min || x > bounds.x.max) return false;
    
    // Check Y bounds for specific X values where provided
    if (bounds.y[x]) {
        return y >= bounds.y[x].min && y <= bounds.y[x].max;
    }
    
    // For other X values in range, estimate bounds
    if (z === 12) {
        return y >= 571 && y <= 579; // Approximate bounds for zoom 12
    } else if (z === 13) {
        return y >= 1142 && y <= 1158; // Approximate bounds for zoom 13
    }
    
    return false;
}

// Convert lat/lng to tile coordinates (Web Mercator projection)
function latLngToTile(lat, lng, z) {
    const n = Math.pow(2, z);
    const latRad = lat * Math.PI / 180;
    const x = Math.floor((lng + 180) / 360 * n);
    const y = Math.floor((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2 * n);
    return { x, y, z };
}

// Convert tile coordinates to lat/lng
function tileToLatLng(z, x, y) {
    const n = Math.pow(2, z);
    const lng = (x / n) * 360 - 180;
    const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n)));
    const lat = latRad * 180 / Math.PI;
    return { lat, lng };
}

// Add click handler to show tile info
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('tile')) {
        const label = e.target.querySelector('.tile-label');
        if (label) {
            const coords = label.textContent.split('/');
            const z = parseInt(coords[0]);
            const x = parseInt(coords[1]);
            const y = parseInt(coords[2]);
            
            const latLng = tileToLatLng(z, x, y);
            
            alert(`Tile Information:
Tile: ${z}/${x}/${y}
Coordinates: ${latLng.lat.toFixed(6)}, ${latLng.lng.toFixed(6)}
Valid: ${isValidTile(z, x, y) ? 'Yes' : 'No'}
URL: https://services2.map.gov.hk/ib20000/tile/${z}/${x}/${y}?blankTile=false`);
        }
    }
});

// Initialize the map when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
});

// Export functions for potential external use
window.HKMap = {
    isValidHKTile,
    tileToLatLng,
    latLngToTile,
    HK_TILE_BOUNDS,
    HONG_KONG_CENTER,
    getCurrentZoom: () => currentZoom,
    getCurrentCenter: () => currentCenter,
    setZoom: (zoom) => {
        if (zoom >= MIN_ZOOM && zoom <= MAX_ZOOM) {
            currentZoom = zoom;
            updateMapView();
        }
    },
    setCenter: (lat, lng) => {
        currentCenter = { lat, lng };
        updateMapView();
    }
};