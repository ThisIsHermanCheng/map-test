class HongKongMapDemo {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.tileSize = 256;
        this.currentZoom = 13;
        this.minZoom = 8;
        this.maxZoom = 18;
        
        // Current view center (in tile coordinates)
        this.centerX = 1538; // Approximate center of available tiles for zoom 13
        this.centerY = 1150; // From the example URL
        
        // Pan offset from center
        this.offsetX = 0;
        this.offsetY = 0;
        
        // Define available tile ranges based on the provided constraints
        this.tileConstraints = {
            8: { x: [96, 100], y: [71, 75] },
            9: { x: [192, 200], y: [142, 150] },
            10: { x: [384, 400], y: [284, 300] },
            11: { x: [768, 800], y: [568, 600] },
            12: { x: [767, 772], y: [571, 579] }, // Known constraint
            13: { x: [1534, 1544], y: [1142, 1158] }, // Known constraint
            14: { x: [3068, 3088], y: [2284, 2316] },
            15: { x: [6136, 6176], y: [4568, 4632] },
            16: { x: [12272, 12352], y: [9136, 9264] },
            17: { x: [24544, 24704], y: [18272, 18528] },
            18: { x: [49088, 49408], y: [36544, 37056] }
        };
        
        this.tiles = new Map();
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.demoMode = false;
        
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
        
        // Demo toggle
        document.getElementById('toggle-demo').addEventListener('click', () => this.toggleDemo());
        
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
        
        // Convert tile coordinates to approximate lat/lng for Hong Kong
        const lat = this.tile2lat(tileY, this.currentZoom);
        const lng = this.tile2lon(tileX, this.currentZoom);
        
        document.getElementById('coordinates').textContent = 
            `Tile: ${tileX}, ${tileY} | Zoom: ${this.currentZoom} | Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
    }
    
    // Convert tile coordinates to lat/lng (Web Mercator)
    tile2lat(y, z) {
        const n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
        return 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    }
    
    tile2lon(x, z) {
        return x / Math.pow(2, z) * 360 - 180;
    }
    
    toggleDemo() {
        this.demoMode = !this.demoMode;
        const button = document.getElementById('toggle-demo');
        
        if (this.demoMode) {
            button.textContent = 'Real Mode';
            button.classList.add('active');
        } else {
            button.textContent = 'Demo Mode';
            button.classList.remove('active');
        }
        
        this.clearTiles();
        this.render();
    }
    
    zoomIn() {
        if (this.currentZoom < this.maxZoom) {
            const oldZoom = this.currentZoom;
            this.currentZoom++;
            
            // Adjust center coordinates for new zoom level
            this.centerX = this.centerX * 2;
            this.centerY = this.centerY * 2;
            this.offsetX = this.offsetX * 2;
            this.offsetY = this.offsetY * 2;
            
            this.updateZoomDisplay();
            this.clearTiles();
            this.render();
        }
    }
    
    zoomOut() {
        if (this.currentZoom > this.minZoom) {
            const oldZoom = this.currentZoom;
            this.currentZoom--;
            
            // Adjust center coordinates for new zoom level
            this.centerX = Math.floor(this.centerX / 2);
            this.centerY = Math.floor(this.centerY / 2);
            this.offsetX = Math.floor(this.offsetX / 2);
            this.offsetY = Math.floor(this.offsetY / 2);
            
            this.updateZoomDisplay();
            this.clearTiles();
            this.render();
        }
    }
    
    updateZoomDisplay() {
        document.getElementById('zoom-level').textContent = `Zoom: ${this.currentZoom}`;
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
        
        if (this.demoMode) {
            // Demo mode - show mock tiles
            setTimeout(() => {
                tileDiv.className = 'map-tile demo';
                tileDiv.innerHTML = `
                    <div>
                        <div>HK Map Tile</div>
                        <div>Z: ${z}</div>
                        <div>X: ${x}, Y: ${y}</div>
                    </div>
                `;
                tile.loaded = true;
            }, Math.random() * 500 + 200);
        } else if (this.isTileAvailable(x, y, z)) {
            // Real mode - try to load actual tiles
            const img = new Image();
            img.onload = () => {
                tileDiv.innerHTML = '';
                tileDiv.appendChild(img);
                tileDiv.className = 'map-tile';
                tile.loaded = true;
            };
            
            img.onerror = () => {
                tileDiv.className = 'map-tile error';
                tileDiv.textContent = 'Tile not available (blocked)';
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
        
        // Render visible tiles
        for (let tileX = startTileX; tileX <= endTileX; tileX++) {
            for (let tileY = startTileY; tileY <= endTileY; tileY++) {
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

// Initialize the map when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const map = new HongKongMapDemo('map');
});