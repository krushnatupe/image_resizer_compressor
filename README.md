# Image Resizer & Compressor

A modern, professional, fully responsive web application for resizing, compressing, and optimizing images directly in your browser. No server uploads required - all processing happens locally on your device.

![Image Resizer & Compressor](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Browser](https://img.shields.io/badge/browser-modern-orange.svg)

## Features

### Image Upload
- **Drag & Drop** - Simply drag images onto the upload area
- **File Picker** - Click to browse and select files
- **Clipboard Paste** - Paste images directly (Ctrl+V)
- **Multiple Images** - Process multiple images at once
- **Batch Processing** - Apply settings to all images simultaneously

### Supported Formats
- JPG / JPEG
- PNG
- WEBP
- GIF (first frame only)
- BMP
- SVG
- AVIF (if browser supported)
- TIFF (where supported)

### Resize Options

#### Custom Dimensions
- Set specific width and height in pixels
- Maintain aspect ratio option
- Prevent upscaling option
- Prevent downscaling option

#### Percentage Resize
- Quick presets: 25%, 50%, 75%, 100%, 150%, 200%
- Custom percentage input

#### Preset Sizes
- Instagram Post (1080×1080)
- Instagram Story (1080×1920)
- Instagram Reel Cover (1080×1920)
- Facebook Cover (820×312)
- Facebook Post (1200×630)
- Twitter/X Post (1600×900)
- LinkedIn Post (1200×627)
- YouTube Thumbnail (1280×720)
- YouTube Banner (2560×1440)
- WhatsApp DP (500×500)
- Passport Photo (600×600)
- HD (1280×720)
- Full HD (1920×1080)
- 2K (2560×1440)
- 4K (3840×2160)
- 8K (7680×4320)

### Compression

#### Quality-Based Compression
- Quality slider (1-100)
- Lossless mode for PNG
- Auto-optimize feature

#### Target File Size Compression
- Compress to specific file size (e.g., 50 KB, 100 KB, 1 MB)
- Quick presets: 20 KB, 50 KB, 100 KB, 250 KB, 500 KB, 1 MB, 2 MB, 5 MB
- Custom target size with KB/MB units
- Intelligent iterative compression algorithm
- Automatic quality adjustment
- Dimension reduction when necessary
- ±5% target size accuracy

#### File Size Increase
- Attempts to increase file size when target is larger than original
- Uses highest quality settings
- Preserves metadata when possible
- Clear messaging when target cannot be achieved naturally

### Format Conversion
- Convert to JPG
- Convert to PNG
- Convert to WEBP
- Keep original format
- Automatic format detection

### Preview & Comparison
- **Side-by-Side Preview** - Compare original and processed images
- **Slider Comparison** - Interactive before/after slider
- **Live Statistics** - Real-time file size, dimensions, reduction percentage
- **Quality Information** - Shows actual quality used

### Download Options
- Download individual images
- Custom file naming
- Download all images at once
- Batch download support

### User Interface
- Modern, professional design
- Responsive layout (mobile-friendly)
- Light/Dark theme with auto-detection
- Smooth animations
- Card-based design
- Gradient header
- Rounded corners
- Progress indicators
- Loading spinners
- Toast notifications
- Error handling
- Success messages

### Accessibility
- Keyboard navigation support
- Screen reader compatible
- ARIA labels
- Focus states
- High contrast mode support
- Reduced motion support

## Browser Support

### Recommended Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Feature Support
- **Canvas API** - Required for image processing
- **File API** - Required for file handling
- **Blob API** - Required for file generation
- **Clipboard API** - Required for paste functionality

### Format Support by Browser
| Format | Chrome | Firefox | Safari | Edge |
|--------|--------|---------|--------|------|
| JPG    | ✅     | ✅      | ✅     | ✅   |
| PNG    | ✅     | ✅      | ✅     | ✅   |
| WEBP   | ✅     | ✅      | ✅     | ✅   |
| GIF    | ✅     | ✅      | ✅     | ✅   |
| BMP    | ✅     | ✅      | ✅     | ✅   |
| SVG    | ✅     | ✅      | ✅     | ✅   |
| AVIF   | ✅     | ✅      | ✅     | ✅   |
| TIFF   | ⚠️     | ⚠️      | ⚠️     | ⚠️   |

*⚠️ = Limited support, may not work in all browsers*

## Installation

### Method 1: Direct Download
1. Download the repository as a ZIP file
2. Extract to your desired location
3. Open `index.html` in your browser

### Method 2: Clone Repository
```bash
git clone <repository-url>
cd image_resizer
```

### Method 3: Local Server (Optional)
For better performance with large files, you can use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## How to Use

### Basic Workflow

1. **Upload Images**
   - Drag and drop images onto the upload area
   - Click the upload area to browse files
   - Or paste images from clipboard (Ctrl+V)

2. **Select Image**
   - Click on an image in the list to select it
   - The selected image will be highlighted

3. **Configure Settings**
   - Choose resize mode (Custom, Percentage, or Presets)
   - Set dimensions or select a preset
   - Configure compression options
   - Select output format

4. **Process Images**
   - Click "Process Images" button
   - Wait for processing to complete
   - View the preview and statistics

5. **Download**
   - Enter custom file name (optional)
   - Click "Download Image" for single download
   - Or click "Download All (ZIP)" for batch download

### Advanced Features

#### Target File Size Compression
1. Select "Target File Size" compression mode
2. Choose a preset or enter custom size
3. Select unit (KB or MB)
4. Process images
5. The algorithm will automatically adjust quality and dimensions to reach the target

#### Batch Processing
1. Upload multiple images
2. Configure desired settings
3. Click "Process Images"
4. All images will be processed with the same settings
5. Use "Download All" to download all processed images

#### Format Conversion
1. Select desired output format (JPG, PNG, WEBP)
2. Process images
3. Images will be converted automatically

#### Aspect Ratio Control
- Enable "Maintain Aspect Ratio" to preserve image proportions
- Disable it to stretch images to exact dimensions
- Use "Prevent Upscaling" to avoid enlarging images
- Use "Prevent Downscaling" to avoid reducing image size

## Project Structure

```
image_resizer/
│── index.html          # Main HTML file
│── style.css           # Styles and responsive design
│── script.js           # Core JavaScript functionality
│── README.md           # Documentation
│── assets/             # Asset directory (empty, for future use)
```

## Technical Details

### Core Technologies
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Variables, Flexbox, Grid
- **Vanilla JavaScript (ES6+)** - No frameworks or libraries
- **Canvas API** - Image processing and manipulation
- **FileReader API** - File reading and data URL conversion
- **Blob API** - File generation and download
- **Clipboard API** - Paste functionality

### Key Algorithms

#### Compression Algorithm
The target file size compression uses an iterative binary search approach:
1. Start with high quality (0.95)
2. Compress image and check file size
3. Adjust quality based on result
4. Repeat until within ±5% of target
5. If still too large, gradually reduce dimensions
6. Return best achievable result

#### Resize Algorithm
- Calculates aspect ratio preservation
- Applies upscaling/downscaling constraints
- Uses high-quality canvas scaling
- Maintains image quality with smoothing

#### Format Conversion
- Detects browser format support
- Converts using Canvas API
- Preserves image data during conversion
- Handles unsupported formats gracefully

### Performance Optimization
- Asynchronous processing to keep UI responsive
- Memory-efficient image handling
- Lazy loading of previews
- Debounced input handling
- Optimized canvas operations

### Memory Management
- Processes images up to 20 MB efficiently
- Cleans up object URLs to prevent memory leaks
- Uses efficient data structures
- Implements proper garbage collection patterns

## Limitations

### Browser Limitations
- **GIF Processing** - Only first frame is processed
- **TIFF Support** - Limited browser support
- **AVIF Support** - Requires modern browsers
- **Memory** - Very large images (>20 MB) may be slow on older devices
- **ZIP Creation** - Currently downloads files individually (ZIP library would require external dependency)

### Feature Limitations
- No server-side processing (by design)
- No cloud storage integration
- No advanced image editing (filters, effects)
- No EXIF metadata preservation
- No animated GIF support
- No multi-page TIFF support

## Security & Privacy

### Data Privacy
- **100% Client-Side** - All processing happens in your browser
- **No Server Uploads** - Images never leave your device
- **No Tracking** - No analytics or tracking scripts
- **No External Requests** - Works completely offline

### Best Practices
- Images are processed in memory only
- Temporary object URLs are revoked after use
- No persistent storage of user data
- No cookies or local storage for sensitive data

## Future Improvements

### Planned Features
- [ ] JSZip integration for true ZIP downloads
- [ ] EXIF metadata preservation
- [ ] Advanced image filters (brightness, contrast, saturation)
- [ ] Crop tool
- [ ] Rotate and flip options
- [ ] Watermarking
- [ ] Batch rename patterns
- [ ] Image format detection improvements
- [ ] Progressive JPEG support
- [ ] WebP animation support

### Performance Enhancements
- [ ] Web Workers for background processing
- [ ] SIMD optimizations for large images
- [ ] Memory pool management
- [ ] Progressive loading for very large images

### UI/UX Improvements
- [ ] Drag-and-drop reordering of images
- [ ] Keyboard shortcuts
- [ ] Custom preset management
- [ ] Export/import settings
- [ ] Undo/redo functionality
- [ ] More comparison modes

## Troubleshooting

### Common Issues

#### Images Not Loading
- **Cause**: Browser doesn't support the image format
- **Solution**: Convert to a more common format (JPG, PNG, WEBP)

#### Processing Slow
- **Cause**: Large image files or older device
- **Solution**: Reduce image size before processing, or use a more powerful device

#### Target Size Not Achieved
- **Cause**: Image cannot be compressed to target size without excessive quality loss
- **Solution**: The app will use the best possible quality and display a message

#### Download Not Working
- **Cause**: Browser popup blocker
- **Solution**: Allow popups for this site, or try a different browser

#### Clipboard Paste Not Working
- **Cause**: Browser permission denied
- **Solution**: Grant clipboard permissions when prompted

### Browser-Specific Issues

#### Safari
- Some formats may not be supported
- Use JPG or PNG for best compatibility

#### Firefox
- AVIF support may be limited
- Use WEBP as alternative

#### Mobile Browsers
- Large images may cause memory issues
- Process one image at a time on mobile devices

## Development

### Local Development
1. Open the project in your code editor
2. Make changes to HTML, CSS, or JavaScript
3. Refresh the browser to see changes
4. No build process required

### Code Structure
- **Modular Functions** - Each feature has dedicated functions
- **State Management** - Centralized state object
- **Event Delegation** - Efficient event handling
- **Error Handling** - Comprehensive try-catch blocks
- **Validation** - Input validation throughout

### Adding New Features
1. Add UI elements to `index.html`
2. Add styles to `style.css`
3. Implement logic in `script.js`
4. Update event listeners
5. Test thoroughly

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly across browsers
5. Submit a pull request

### Coding Standards
- Use ES6+ JavaScript features
- Follow existing code style
- Add comments for complex logic
- Ensure accessibility compliance
- Test on multiple browsers

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

- Built with vanilla HTML, CSS, and JavaScript
- No external frameworks or libraries
- Inspired by TinyPNG, iLoveIMG, and similar tools

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Provide browser and OS information when reporting bugs

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Core image processing functionality
- Multiple upload methods
- Resize options (custom, percentage, presets)
- Quality-based compression
- Target file size compression
- Format conversion
- Batch processing
- Preview and comparison
- Download functionality
- Light/Dark theme
- Responsive design
- Accessibility features

---

**Made with ❤️ for the web community**

*All processing happens locally in your browser. Your images never leave your device.*
