# Hong Kong Interactive Map

A professional-grade interactive map application built with modern HTML, CSS, and JavaScript that provides precise tile positioning and comprehensive zoom level support for Hong Kong mapping data.

![Hong Kong Interactive Map](https://github.com/user-attachments/assets/70066b7d-fd45-4bdd-a05f-b59f5f6a4c92)

## Features

- **Comprehensive Zoom Support**: Full zoom range from 8-18 with precise tile coordinate mapping
- **Professional Tile Management**: Class-based architecture with proper tile caching and positioning
- **Precise Coordinate System**: Accurate tile coordinate calculations based on confirmed Hong Kong Government tile constraints
- **Interactive Controls**: Smooth zoom controls with +/- buttons and responsive pan functionality
- **Real-time Coordinate Display**: Click anywhere on the map to see exact tile coordinates
- **Touch-Enabled**: Full support for mobile devices with touch events
- **Performance Optimized**: Efficient tile rendering and memory management

## Technical Architecture

### Tile Coordinate System
Built using the proven coordinate constraints provided by the Hong Kong Government mapping service:

```
Zoom Level | X Range      | Y Range
8          | 47-49        | 35-37
9          | 95-97        | 71-73
10         | 191-193      | 142-145
11         | 383-386      | 285-290
12         | 767-772      | 571-579
13         | 1534-1544    | 1142-1158
14         | 3068-3088    | 2284-2315
15         | 6136-6176    | 4568-4630
16         | 12273-12352  | 9136-9259
17         | 24546-24704  | 18272-18518
18         | 49093-49408  | 36544-37036
```

### Class-Based Implementation
The application is built around a robust `HongKongMap` class that handles:

- **Tile Management**: Efficient loading, caching, and positioning of map tiles
- **Event Handling**: Mouse and touch events for panning and zooming
- **Coordinate Calculations**: Precise screen-to-tile coordinate conversions
- **Viewport Management**: Dynamic tile rendering based on visible area

## Usage

### Local Development
```bash
# Using Python's built-in server
python3 -m http.server 8000

# Using Node.js http-server (if installed)
npx http-server

# Then open http://localhost:8000 in your browser
```

### Interactive Controls
- **Zoom**: Use `+` and `-` buttons to change zoom levels (8-18)
- **Pan**: Click and drag the map to navigate around Hong Kong
- **Coordinate Info**: Click anywhere on the map to see tile coordinates
- **Touch Support**: Full gesture support on mobile devices

## API Reference

### HongKongMap Class

```javascript
// Initialize the map
const map = new HongKongMap('map-container-id');

// Public methods
map.zoomIn();           // Increase zoom level
map.zoomOut();          // Decrease zoom level
map.render();           // Re-render the map
```

### Configuration Options
- **Tile Size**: 256px standard web map tiles
- **Zoom Range**: 8 (regional view) to 18 (street level detail)
- **Coordinate System**: Web Mercator (EPSG:3857)
- **Tile Source**: Hong Kong Government Map Service

## Project Structure

```
├── index.html          # Main HTML structure with semantic layout
├── styles.css          # Modern CSS with responsive design
├── script.js           # ES6+ JavaScript with class-based architecture
├── readme.md           # Comprehensive documentation
└── .gitignore          # Git ignore configuration
```

## Technical Highlights

### Precise Tile Positioning
```javascript
// Calculate exact tile position based on screen coordinates
const screenX = (tileX - this.centerX) * this.tileSize + centerScreenX + this.offsetX;
const screenY = (tileY - this.centerY) * this.tileSize + centerScreenY + this.offsetY;
```

### Efficient Viewport Rendering
```javascript
// Only render tiles within the visible viewport plus buffer
for (let tileY = startTileY; tileY <= endTileY; tileY++) {
    for (let tileX = startTileX; tileX <= endTileX; tileX++) {
        if (this.isTileAvailable(tileX, tileY, this.currentZoom)) {
            // Render tile
        }
    }
}
```

### Touch and Mouse Event Handling
```javascript
// Unified event handling for desktop and mobile
this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
this.container.addEventListener('touchstart', this.handleTouchStart.bind(this));
```

## Browser Compatibility

- **Modern Browsers**: Supports all current versions of Chrome, Firefox, Safari, and Edge
- **ES6+ Features**: Uses modern JavaScript features including classes and arrow functions
- **CSS Grid**: Utilizes CSS Grid for responsive layout design
- **Mobile Support**: Optimized for touch devices and responsive breakpoints

## Performance Features

- **Tile Caching**: Intelligent tile reuse to minimize network requests
- **Lazy Loading**: Tiles only load when needed for current viewport
- **Memory Management**: Automatic cleanup of off-screen tiles
- **Smooth Animations**: Hardware-accelerated transforms for panning

## Development Guidelines

### Code Architecture
- **Class-based design** for maintainable object-oriented structure
- **Event-driven architecture** for responsive user interactions
- **Separation of concerns** between rendering, events, and data management

### Best Practices
- **Error handling** for failed tile requests
- **Performance optimization** for smooth user experience
- **Accessibility support** with keyboard navigation
- **Cross-platform compatibility** for desktop and mobile

## Contributing

This project demonstrates advanced web mapping techniques with precise coordinate handling. Areas for potential enhancement:

- WebGL rendering for improved performance
- Custom overlay support for markers and shapes
- Offline caching with Service Workers
- Multi-touch gesture support for advanced navigation

## License

This project demonstrates the use of Hong Kong Government map tiles. Please refer to the [Hong Kong Government Map Terms](https://services2.map.gov.hk/ib20000/ib20000.html) for official usage guidelines.

## Acknowledgments

Built following the technical specifications and coordinate constraints provided by the Hong Kong Government mapping service for accurate geographic representation.
