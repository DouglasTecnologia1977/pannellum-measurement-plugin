import PannellumMeasurement from './plugins/PannellumMeasurement';
import measurementReducer from './reducers/measurement';
import calibrationReducer from './reducers/calibration';
import measurementEpics from './epics/measurementEpics';
import pluginConfig from './pluginConfig';

export default {
    name: pluginConfig.name,
    component: PannellumMeasurement,
    reducers: {
        measurement: measurementReducer,
        calibration: calibrationReducer
    },
    epics: measurementEpics,
    containers: {
        Map: {
            priority: pluginConfig.cfg.toolbar.priority,
            position: pluginConfig.cfg.toolbar.position
        }
    },
    plugins: {
        Toolbar: {
            name: 'PannellumMeasurement',
            position: pluginConfig.cfg.toolbar.position,
            priority: pluginConfig.cfg.toolbar.priority,
            title: 'Panorama Measurement',
            tooltip: 'Open Panorama Measurement Tools',
            icon: pluginConfig.cfg.toolbar.icon || '<svg>...</svg>',
            action: () => toggleControl('pannellumMeasurement')
        }
    },
    settings: pluginConfig.settings
};