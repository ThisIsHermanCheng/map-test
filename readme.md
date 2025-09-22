# Hong Kong Interactive Map

A fully functional interactive map application built with HTML, CSS, and JavaScript that provides comprehensive mapping capabilities with multiple tile sources and zoom levels.

![Hong Kong Interactive Map](https://github.com/user-attachments/assets/49eb2b4b-69e9-49a9-a12e-9053cc85b698)

## Features

- **Full Zoom Range**: Support for zoom levels 1-18, providing global coverage down to street-level detail
- **Multiple Tile Sources**: Seamlessly switches between Hong Kong Government tiles (zoom 12-13) and OpenStreetMap (all zoom levels)
- **Interactive Controls**: Zoom in/out using buttons or keyboard shortcuts (+/- keys)
- **Dynamic Tile Management**: Automatically selects the best tile source based on zoom level and coverage
- **Real-time Information**: Display current coordinates, zoom level, and tile information
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Smart Fallback**: Uses OpenStreetMap tiles when HK Government tiles are unavailable

## Tile Sources

### Hong Kong Government Maps (Zoom 12-13)
- **High-resolution official maps** for Hong Kong territory
- **Base URL**: `https://services2.map.gov.hk/ib20000/tile/{z}/{x}/{y}?blankTile=false`
- **Coverage**: Limited to specific tile coordinates within Hong Kong

### OpenStreetMap (Zoom 1-18)
- **Global coverage** with community-driven mapping data
- **Base URL**: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
- **Fallback source** for areas and zoom levels outside HK Government coverage

## Usage

### Local Development
```bash
# Using Python's built-in server
python3 -m http.server 8000

# Using Node.js http-server (if installed)
npx http-server

# Then open http://localhost:8000 in your browser
```

### Controls
- **Zoom In**: Click the `+` button or press `+` key
- **Zoom Out**: Click the `-` button or press `-` key
- **Pan**: Click and drag the map (touch-enabled for mobile)
- **Tile Information**: Click on any tile to view detailed coordinate information

## Technical Implementation

### Coordinate System
- **Projection**: Web Mercator (EPSG:3857)
- **Center**: Hong Kong (22.396428°N, 114.109497°E)
- **Tile Scheme**: Standard XYZ tile scheme with automatic coordinate conversion

### Smart Tile Selection
The application intelligently selects the appropriate tile source:

```javascript
// Automatically chooses HK Government tiles when available
if (isValidHKTile(z, x, y)) {
    // Use high-resolution HK Government tiles
    tileUrl = `https://services2.map.gov.hk/ib20000/tile/${z}/${x}/${y}?blankTile=false`;
} else {
    // Fallback to OpenStreetMap for global coverage
    tileUrl = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
}
```

### Key Functions
- `initializeMap()`: Initialize map and controls
- `createTileGrid()`: Generate responsive tile grid based on current view
- `isValidHKTile(z, x, y)`: Check if HK Government tiles are available for coordinates
- `latLngToTile()` / `tileToLatLng()`: Coordinate conversion utilities
- `setupMapControls()`: Handle zoom controls and keyboard shortcuts

## Project Structure

```
├── index.html          # Main HTML page with responsive layout
├── styles.css          # CSS styling with modern design
├── script.js           # JavaScript functionality and tile management
├── readme.md           # Project documentation
└── .gitignore          # Git ignore file
```

## Features in Detail

### Responsive Tile Grid
- **4x3 tile grid** that adapts to different zoom levels
- **Visual distinction** between tile sources using color-coded borders
- **Loading animations** and error handling for failed tile requests

### Information Panel
- **Real-time coordinates** showing current map center
- **Current zoom level** with source indicator
- **Tile coordinates** in Z/X/Y format
- **Source legend** explaining available tile layers

### Keyboard Support
- Press `+` or `=` to zoom in
- Press `-` to zoom out
- Intuitive controls for better user experience

## Browser Compatibility

- **Modern browsers** supporting ES6+ features
- **CSS Grid** support required for tile layout
- **Touch events** supported for mobile devices
- **Keyboard navigation** for accessibility

## Contributing

This project demonstrates advanced web mapping techniques with multiple tile sources. Feel free to submit issues and enhancement requests for additional features like:

- Additional tile sources
- Geolocation support
- Offline caching
- Custom markers and overlays

## License

This project demonstrates the use of Hong Kong Government map tiles and OpenStreetMap data. Please refer to each service's terms of use:
- [Hong Kong Government Map Terms](https://services2.map.gov.hk/ib20000/ib20000.html)
- [OpenStreetMap Copyright](https://www.openstreetmap.org/copyright)
