import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import 'pannellum/build/pannellum.css';
import pannellum from 'pannellum';

const PannellumViewer = ({ 
    panoramaUrl, 
    onPointSelected, 
    measurementPoints, 
    measurementMode,
    distances,
    areas,
    scaleFactor
}) => {
    const viewerRef = useRef(null);
    const [viewer, setViewer] = useState(null);

    // Initialize viewer
    useEffect(() => {
        if (!viewerRef.current) return;

        const newViewer = pannellum.viewer(viewerRef.current, {
            type: 'equirectangular',
            panorama: panoramaUrl || 'https://pannellum.org/images/alma.jpg',
            autoLoad: true,
            hotSpotDebug: false,
            showZoomCtrl: false,
            mouseZoom: false
        });

        setViewer(newViewer);

        return () => {
            if (newViewer) {
                newViewer.destroy();
            }
        };
    }, [panoramaUrl]);

    // Handle click events
    useEffect(() => {
        if (!viewer) return;

        const handleClick = (e) => {
            const pitch = viewer.mouseEventToCoords(e)[0];
            const yaw = viewer.mouseEventToCoords(e)[1];
            onPointSelected({ pitch, yaw });
        };

        viewer.on('mousedown', handleClick);

        return () => {
            viewer.off('mousedown', handleClick);
        };
    }, [viewer, onPointSelected]);

    // Update measurement visuals
    useEffect(() => {
        if (!viewer || !measurementPoints) return;

        viewer.removeAllHotSpots();

        // Add measurement points
        measurementPoints.forEach((point, index) => {
            viewer.addHotSpot({
                id: `measurement-${index}`,
                pitch: point.pitch,
                yaw: point.yaw,
                type: 'info',
                text: `Point ${index + 1}`,
                cssClass: 'measurement-point'
            });
        });

        // Add distance lines
        if (measurementMode === 'distance' && measurementPoints.length > 1) {
            for (let i = 0; i < measurementPoints.length - 1; i++) {
                const p1 = measurementPoints[i];
                const p2 = measurementPoints[i + 1];
                
                viewer.addHotSpot({
                    id: `line-${i}`,
                    pitch: (p1.pitch + p2.pitch) / 2,
                    yaw: (p1.yaw + p2.yaw) / 2,
                    type: 'info',
                    text: `${(distances[i] * (scaleFactor || 1)).toFixed(2)} ${scaleFactor ? 'm' : 'units'}`,
                    cssClass: 'measurement-line'
                });
            }
        }

        // Add area markers
        if (measurementMode === 'area' && measurementPoints.length > 2) {
            viewer.addHotSpot({
                id: 'area-center',
                pitch: measurementPoints.reduce((sum, p) => sum + p.pitch, 0) / measurementPoints.length,
                yaw: measurementPoints.reduce((sum, p) => sum + p.yaw, 0) / measurementPoints.length,
                type: 'info',
                text: `Area: ${(areas[areas.length - 1] * (scaleFactor || 1)).toFixed(2)} ${scaleFactor ? 'm²' : 'units²'}`,
                cssClass: 'measurement-area'
            });
        }
    }, [viewer, measurementPoints, measurementMode, distances, areas, scaleFactor]);

    return (
        <div 
            ref={viewerRef} 
            id="pannellum-viewer" 
            style={{ width: '100%', height: '500px', position: 'relative' }}
        />
    );
};

PannellumViewer.propTypes = {
    panoramaUrl: PropTypes.string,
    onPointSelected: PropTypes.func.isRequired,
    measurementPoints: PropTypes.array,
    measurementMode: PropTypes.string,
    distances: PropTypes.array,
    areas: PropTypes.array,
    scaleFactor: PropTypes.number
};

export default PannellumViewer;