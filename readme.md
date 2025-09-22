# Hong Kong Interactive Map

An interactive web map of Hong Kong using the Hong Kong Government's official tile service API.

## Features

- **Interactive Map Interface**: Pan, zoom, and navigate around Hong Kong
- **Government Tile Service**: Uses official HK Government mapping tiles
- **Responsive Design**: Works on desktop and mobile devices  
- **Custom Controls**: Zoom controls, reset view, and information panel
- **Error Handling**: Graceful handling of tile loading issues

## API Information

The map uses the Hong Kong Government tile service:

```
https://services2.map.gov.hk/ib20000/tile/{z}/{x}/{y}?blankTile=false
```

### Available Tile Coordinates

**Zoom Level 12:**
- X coordinates: 767-772
- Y coordinates: 571-579 (for x=771)

**Zoom Level 13:**
- X coordinates: 1534-1544  
- Y coordinates: 1142-1158 (for x=1534)

## Files Structure

```
├── index.html          # Main HTML file
├── script.js           # JavaScript map functionality
├── style.css           # CSS styling
├── lib/               # Leaflet library files
│   ├── leaflet.js
│   ├── leaflet.css
│   └── images/        # Leaflet UI images
└── README.md          # This file
```

## Usage

1. **Local Development**: Open `index.html` in a web browser or serve via a local HTTP server:
   ```bash
   python3 -m http.server 8000
   # Then visit http://localhost:8000
   ```

2. **Web Deployment**: Upload all files to a web server and access via the web.

## Map Controls

- **Zoom In/Out**: Use the + and - buttons
- **Reset View**: Click "Reset View" to return to Hong Kong center
- **Pan**: Click and drag to move around the map
- **Info Panel**: Shows current zoom levels and API information

## Technical Details

- **Library**: Leaflet.js v1.9.4 for map rendering
- **Coordinate System**: Standard Web Mercator (EPSG:3857)
- **Tile Format**: PNG images from HK Government service
- **Zoom Range**: Levels 12-13 (as available from the API)

## Browser Compatibility

- Modern browsers with JavaScript enabled
- Internet connection required for tile loading
- CORS-enabled environment for external tile requests

## Reference

Based on the Hong Kong Government mapping service:
https://services2.map.gov.hk/ib20000/ib20000.html
