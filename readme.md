# Hong Kong Interactive Map

An interactive map application built with HTML, CSS, and JavaScript that displays Hong Kong using the Hong Kong Government map tile service.

![Hong Kong Interactive Map](https://github.com/user-attachments/assets/0eda627a-2378-42c1-bd23-5b76090fd21e)

## Features

- **Interactive Map Interface**: View Hong Kong map tiles in a responsive grid layout
- **Zoom Controls**: Switch between zoom levels 12 and 13
- **Coordinate System**: Uses Web Mercator (EPSG:3857) projection
- **Tile Information**: Display current view coordinates and tile indices
- **Responsive Design**: Works on desktop and mobile devices

## Map Tile Service

This application uses the Hong Kong Government map tile service:
- **Base URL**: `https://services2.map.gov.hk/ib20000/tile/{z}/{x}/{y}?blankTile=false`
- **Reference**: [Hong Kong Government Map Service](https://services2.map.gov.hk/ib20000/ib20000.html)

### Available Tile Coverage

**Zoom Level 12:**
- X range: 767-772
- Y range: 571-579 (specifically for X=771)

**Zoom Level 13:**
- X range: 1534-1544  
- Y range: 1142-1158 (specifically for X=1534)

## Project Structure

```
├── index.html          # Main HTML page
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── readme.md           # Project documentation
```

## Usage

1. **Local Development**: Open `index.html` in a web browser or serve via HTTP server
2. **Zoom Controls**: Use + and - buttons to switch between zoom levels
3. **Map Information**: View current coordinates and tile information in the info panel

### Running Locally

```bash
# Using Python's built-in server
python3 -m http.server 8000

# Using Node.js http-server (if installed)
npx http-server

# Then open http://localhost:8000 in your browser
```

## Technical Details

### Coordinate System
- **Projection**: Web Mercator (EPSG:3857)
- **Center**: Hong Kong (22.396428°N, 114.109497°E)
- **Tile Scheme**: Standard XYZ tile scheme

### JavaScript Functions
- `initializeMap()`: Initialize map and controls
- `createTileGrid()`: Generate tile grid based on zoom level
- `isValidTile(z, x, y)`: Validate tile coordinates against known bounds
- `latLngToTile()` / `tileToLatLng()`: Coordinate conversion utilities

### CSS Features
- Responsive grid layout for map tiles
- Modern gradient styling
- Interactive controls with hover effects
- Mobile-friendly design

## Browser Compatibility

- Modern browsers supporting ES6+
- CSS Grid support required
- Works on desktop and mobile devices

## License

This project demonstrates the use of Hong Kong Government map tiles. Please refer to the Hong Kong Government's terms of service for the map tile usage.

## Contributing

Feel free to submit issues and enhancement requests!
