class HongKongMap {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.tileSize = 256;
        this.currentZoom = 13;
        this.minZoom = 8;
        this.maxZoom = 18;
        
        // Current view center (in tile coordinates) - will be calculated per zoom level
        this.centerX = 1539; // Default for zoom 13
        this.centerY = 1150; // Default for zoom 13
        
        // Pan offset from center
        this.offsetX = 0;
        this.offsetY = 0;
        
        // Define available tile ranges based on the confirmed constraints
        this.tileConstraints = {
            8: { x: [47, 49], y: [35, 37] },
            9: { x: [95, 97], y: [71, 73] },
            10: { x: [191, 193], y: [142, 145] },
            11: { x: [383, 386], y: [285, 290] },
            12: { x: [767, 772], y: [571, 579] },
            13: { x: [1534, 1544], y: [1142, 1158] },
            14: { x: [3068, 3088], y: [2284, 2315] },
            15: { x: [6136, 6176], y: [4568, 4630] },
            16: { x: [12273, 12352], y: [9136, 9259] },
            17: { x: [24546, 24704], y: [18272, 18518] },
            18: { x: [49093, 49408], y: [36544, 37036] }
        };
        
        this.tiles = new Map();
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        
        // Initialize center coordinates for current zoom level
        this.updateCenterForZoom();
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.render();
        this.updateZoomDisplay();
    }
    
    setupEventListeners() {
        // Mouse events for panning
        this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.container.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.container.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.container.addEventListener('mouseleave', this.handleMouseUp.bind(this));
        
        // Touch events for mobile
        this.container.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.container.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.container.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // Prevent context menu
        this.container.addEventListener('contextmenu', e => e.preventDefault());
        
        // Zoom controls
        document.getElementById('zoom-in').addEventListener('click', () => this.zoomIn());
        document.getElementById('zoom-out').addEventListener('click', () => this.zoomOut());
        
        // Click coordinates
        this.container.addEventListener('click', this.handleClick.bind(this));
        
        // Prevent image dragging
        this.container.addEventListener('dragstart', e => e.preventDefault());
    }
    
    handleMouseDown(e) {
        this.isDragging = true;
        this.dragStart = { x: e.clientX, y: e.clientY };
        this.container.style.cursor = 'grabbing';
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        const deltaX = e.clientX - this.dragStart.x;
        const deltaY = e.clientY - this.dragStart.y;
        
        this.offsetX += deltaX;
        this.offsetY += deltaY;
        
        this.dragStart = { x: e.clientX, y: e.clientY };
        this.render();
    }
    
    handleMouseUp() {
        this.isDragging = false;
        this.container.style.cursor = 'grab';
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            this.handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
        }
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            this.handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
        }
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        this.handleMouseUp();
    }
    
    handleClick(e) {
        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const tileX = Math.floor((x - this.offsetX + this.container.offsetWidth / 2) / this.tileSize + this.centerX);
        const tileY = Math.floor((y - this.offsetY + this.container.offsetHeight / 2) / this.tileSize + this.centerY);
        
        document.getElementById('coordinates').textContent = 
            `Tile: ${tileX}, ${tileY} | Zoom: ${this.currentZoom}`;
    }
    
    zoomIn() {
        if (this.currentZoom < this.maxZoom) {
            const oldZoom = this.currentZoom;
            this.currentZoom++;
            
            // Reset offsets when changing zoom levels to center properly
            this.offsetX = 0;
            this.offsetY = 0;
            
            // Update center coordinates for new zoom level
            this.updateCenterForZoom();
            
            this.updateZoomDisplay();
            this.clearTiles();
            this.render();
        }
    }
    
    zoomOut() {
        if (this.currentZoom > this.minZoom) {
            const oldZoom = this.currentZoom;
            this.currentZoom--;
            
            // Reset offsets when changing zoom levels to center properly
            this.offsetX = 0;
            this.offsetY = 0;
            
            // Update center coordinates for new zoom level
            this.updateCenterForZoom();
            
            this.updateZoomDisplay();
            this.clearTiles();
            this.render();
        }
    }
    
    updateZoomDisplay() {
        document.getElementById('zoom-level').textContent = `Zoom: ${this.currentZoom}`;
    }
    
    updateCenterForZoom() {
        const constraints = this.tileConstraints[this.currentZoom];
        if (constraints) {
            // Center within the valid tile range
            this.centerX = Math.floor((constraints.x[0] + constraints.x[1]) / 2);
            this.centerY = Math.floor((constraints.y[0] + constraints.y[1]) / 2);
        }
    }
    
    clearTiles() {
        this.tiles.forEach(tile => {
            if (tile.element && tile.element.parentNode) {
                tile.element.parentNode.removeChild(tile.element);
            }
        });
        this.tiles.clear();
    }
    
    isTileAvailable(x, y, z) {
        const constraints = this.tileConstraints[z];
        if (!constraints) return false;
        
        return x >= constraints.x[0] && x <= constraints.x[1] &&
               y >= constraints.y[0] && y <= constraints.y[1];
    }
    
    createTileElement(x, y, z) {
        const tileKey = `${z}-${x}-${y}`;
        
        if (this.tiles.has(tileKey)) {
            return this.tiles.get(tileKey).element;
        }
        
        const tileDiv = document.createElement('div');
        tileDiv.className = 'map-tile loading';
        
        const tile = { element: tileDiv, loaded: false };
        this.tiles.set(tileKey, tile);
        
        if (this.isTileAvailable(x, y, z)) {
            const img = new Image();
            img.onload = () => {
                tileDiv.innerHTML = '';
                tileDiv.appendChild(img);
                tileDiv.className = 'map-tile';
                tile.loaded = true;
            };
            
            img.onerror = () => {
                tileDiv.className = 'map-tile error';
                tileDiv.textContent = 'Tile not available';
            };
            
            const url = `https://services2.map.gov.hk/ib20000/tile/${z}/${x}/${y}?blankTile=false`;
            img.src = url;
        } else {
            tileDiv.className = 'map-tile error';
            tileDiv.textContent = 'Out of bounds';
        }
        
        return tileDiv;
    }
    
    render() {
        // Clear existing tiles from DOM
        const existingTiles = this.container.querySelectorAll('.map-tile');
        existingTiles.forEach(tile => tile.remove());
        
        const containerWidth = this.container.offsetWidth;
        const containerHeight = this.container.offsetHeight;
        
        // Calculate which tiles are visible
        const centerScreenX = containerWidth / 2;
        const centerScreenY = containerHeight / 2;
        
        // Calculate tile coordinates for the current view
        const startTileX = Math.floor((centerScreenX - this.offsetX) / this.tileSize) + this.centerX - Math.ceil(containerWidth / this.tileSize / 2) - 1;
        const endTileX = startTileX + Math.ceil(containerWidth / this.tileSize) + 2;
        const startTileY = Math.floor((centerScreenY - this.offsetY) / this.tileSize) + this.centerY - Math.ceil(containerHeight / this.tileSize / 2) - 1;
        const endTileY = startTileY + Math.ceil(containerHeight / this.tileSize) + 2;
        
        // Get valid tile constraints for current zoom level
        const constraints = this.tileConstraints[this.currentZoom];
        
        // Render visible tiles, but only within valid constraints
        for (let tileX = startTileX; tileX <= endTileX; tileX++) {
            for (let tileY = startTileY; tileY <= endTileY; tileY++) {
                // Only render tiles within valid constraints
                if (constraints && 
                    tileX >= constraints.x[0] && tileX <= constraints.x[1] &&
                    tileY >= constraints.y[0] && tileY <= constraints.y[1]) {
                    
                    const tileElement = this.createTileElement(tileX, tileY, this.currentZoom);
                    
                    // Position the tile
                    const screenX = (tileX - this.centerX) * this.tileSize + centerScreenX + this.offsetX;
                    const screenY = (tileY - this.centerY) * this.tileSize + centerScreenY + this.offsetY;
                    
                    tileElement.style.left = `${screenX}px`;
                    tileElement.style.top = `${screenY}px`;
                    
                    this.container.appendChild(tileElement);
                }
            }
        }
    }
}

// Initialize the map when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const map = new HongKongMap('map');
});