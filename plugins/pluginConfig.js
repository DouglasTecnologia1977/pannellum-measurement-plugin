export default {
    name: 'PannellumMeasurement',
    title: 'Panorama Measurement',
    description: 'Interactive panorama viewer with measurement tools',
    cfg: {
        toolbar: {
            position: 10,
            priority: 1,
            icon: `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 5.5A6.5 6.5 0 0 1 18.5 12c0 .5-.06 1-.17 1.5h1.43c.12-.5.19-1 .19-1.5A8 8 0 0 0 12 4a8 8 0 0 0-7.96 9h1.51C6.56 13.19 9 5.5 12 5.5m-4.5 4v1.5h-3V16h1.5v-4.5h1.5V16H9v-4.5h1.5v-1.5h-6m6 1.5V16h1.5v-4.5h1.5v-1.5H12v1.5m6 0V16h1.5v-4.5h1.5v-1.5H18v1.5M12 9a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
                </svg>
            `
        }
    },
    settings: {
        defaultPanorama: null,
        enableHotspots: true,
        measurementPrecision: 2,
        defaultRealDistance: 1
    },
    dependencies: {
        'pannellum': '^2.5.6'
    }
};