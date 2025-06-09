# CSV Text Extractor

A lightweight, user-friendly web app to extract all text from column D of a CSV file and copy or download it as plain text.

## Features
- Drag-and-drop or click-to-browse CSV upload
- Extracts all text from column D (the 4th column)
- Displays extracted text in a scrollable, read-only area
- One-click Copy to Clipboard
- One-click Download as UTF-8 .txt file
- Responsive, mobile-friendly, and fast
- No backend: all processing is client-side

## Expected CSV Format
| A (Speaker Name) | B (Start Time) | C (End Time) | D (Text) |
|------------------|---------------|-------------|----------|
| ...              | ...           | ...         | ...      |

## Usage
1. Open the app in your browser (see [Deployment](#deployment)).
2. Drag and drop or click to upload your CSV file.
3. Extracted text from column D will appear instantly.
4. Use the Copy or Download buttons as needed.

## Development
- Built with HTML, CSS, and vanilla JavaScript.
- Linting: [ESLint](https://eslint.org/) recommended for maintainability.
- To run locally, just open `index.html` in your browser.

## Deployment
- Host on GitHub Pages: push to `main` or `gh-pages` branch and enable Pages in repo settings.
- App is fully static and requires no backend.

## Accessibility & Browser Support
- Works on Chrome, Firefox, Edge, Safari (desktop & mobile)
- Keyboard accessible and ARIA live feedback for actions

## License
MIT
