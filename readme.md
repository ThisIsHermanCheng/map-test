# Hong Kong Interactive Map

A fully functional interactive map application using HTML, CSS, and JavaScript that displays Hong Kong map tiles from the government's tile service.

## Features

- ✅ Interactive pan and zoom functionality
- ✅ Real-time coordinate display (tile coordinates and lat/lng)
- ✅ Zoom levels 8-18 support
- ✅ Tile boundary constraints implemented
- ✅ Demo mode with mock tiles
- ✅ Responsive design
- ✅ Touch support for mobile devices
- ✅ Professional UI with controls

## Files

- `index.html` - Main map application
- `map.css` - Styling for the map interface
- `map.js` - Core map functionality
- `demo.html` - Demo version with mock tiles
- `demo.css` - Styling for demo version
- `demo.js` - Demo functionality with mock tile support

## Usage

### Running the Map

1. Open `index.html` in a web browser, or
2. For the demo version, open `demo.html`
3. Use the + and - buttons to zoom in/out
4. Click and drag to pan around the map
5. Click anywhere on the map to see coordinates

### Demo Mode

The demo version (`demo.html`) includes a "Demo Mode" button that switches between:
- **Real Mode**: Attempts to load actual Hong Kong government map tiles
- **Demo Mode**: Shows mock tiles with coordinate information for testing

## Technical Details

### Tile Service API

The map uses the Hong Kong government's tile service:
```
https://services2.map.gov.hk/ib20000/tile/{z}/{x}/{y}?blankTile=false
```

### Coordinate System

Uses Web Mercator projection (EPSG:3857) with the following tile constraints:

- **Zoom 12**: X tiles 767-772, Y tiles 571-579 (for X=771)
- **Zoom 13**: X tiles 1534-1544, Y tiles 1142-1158 (for X=1534)
- Extrapolated ranges for zoom levels 8-18 based on the standard Web Mercator tiling scheme

### Supported Zoom Levels

| Zoom | X Range | Y Range |
|------|---------|---------|
| 8 | 47-49 | 35-37 |
| 9 | 95-97 | 71-73 |
| 10 | 191-193 | 142-145|
| 11 | 383-386 | 285-290 |
| 12 | 767-772 | 571-579 |
| 13 | 1534-1544 | 1142-1158 |
| 14 | 3068-3088 | 2284-2315 |
| 15 | 6136-6176 | 4568-4630 |
| 16 | 12273-12352 | 9136-9259 |
| 17 | 24546-24704 | 18272-18518 |
| 18 | 49093-49408 | 36544-37036 |

## Browser Compatibility

- Chrome/Chromium-based browsers
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Reference

Based on the Hong Kong government's map service: https://services2.map.gov.hk/ib20000/ib20000.html
