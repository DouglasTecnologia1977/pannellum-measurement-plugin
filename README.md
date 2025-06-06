# Pannellum Measurement Plugin for MapStore2

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/seu-usuario/mapstore-pannellum-plugin)](https://github.com/seu-usuario/mapstore-pannellum-plugin/stargazers)

Advanced panorama measurement tools for MapStore2 with distance, area measurement, and calibration features.

[Plugin Demo](assets/images/plugin-screenshot.png)

## Features

- 🌎 Integrated Pannellum panorama viewer
- 📏 Spherical distance measurements
- 📐 Polygon area calculations
- 🎯 Cross-image calibration
- 💾 Measurement persistence
- 📤 JSON/CSV export
- 🖥️ Responsive design

## Installation

```bash
npm install mapstore-pannellum-plugin

````
## Usage
```bash
import PannellumMeasurement from 'mapstore-pannellum-plugin';

// Add to MapStore2 plugins
{
  plugins: {
    desktop: ['PannellumMeasurement']
  }
}

```
## Documentation
Full documentation available at:
Documentation Wiki

## Development
```bash
# Clone repository
git clone https://github.com/DouglasTecnologia1977/mapstore-pannellum-plugin.git

# Install dependencies
npm install

# Build plugin
npm run build

```
License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/DouglasTecnologia1977/pannellum-measurement-plugin/blob/main/LICENSE) file for details.
