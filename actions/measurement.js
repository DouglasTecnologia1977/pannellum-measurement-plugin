export const START_DISTANCE_MEASUREMENT = 'MEASUREMENT/START_DISTANCE';
export const START_AREA_MEASUREMENT = 'MEASUREMENT/START_AREA';
export const ADD_MEASUREMENT_POINT = 'MEASUREMENT/ADD_POINT';
export const CLEAR_MEASUREMENTS = 'MEASUREMENT/CLEAR';
export const SAVE_MEASUREMENTS = 'MEASUREMENT/SAVE';
export const LOAD_MEASUREMENTS = 'MEASUREMENT/LOAD';
export const EXPORT_MEASUREMENTS = 'MEASUREMENT/EXPORT';

export function startDistanceMeasurement() {
    return {
        type: START_DISTANCE_MEASUREMENT
    };
}

export function startAreaMeasurement() {
    return {
        type: START_AREA_MEASUREMENT
    };
}

export function addMeasurementPoint(point) {
    return {
        type: ADD_MEASUREMENT_POINT,
        point
    };
}

export function clearMeasurements() {
    return {
        type: CLEAR_MEASUREMENTS
    };
}

export function saveMeasurements() {
    return {
        type: SAVE_MEASUREMENTS
    };
}

export function loadMeasurements() {
    return {
        type: LOAD_MEASUREMENTS
    };
}

export function exportMeasurements(format = 'json') {
    return (dispatch, getState) => {
        const state = getState().measurement;
        const calibration = getState().calibration;
        
        const data = {
            points: state.points,
            distances: state.distances.map(d => d * (calibration.scaleFactor || 1)),
            areas: state.areas.map(a => a * (calibration.scaleFactor || 1)),
            scaleFactor: calibration.scaleFactor,
            timestamp: new Date().toISOString()
        };
        
        let exportData;
        if (format === 'csv') {
            exportData = convertToCSV(data);
        } else {
            exportData = JSON.stringify(data, null, 2);
        }
        
        dispatch({
            type: EXPORT_MEASUREMENTS,
            format,
            data: exportData
        });
        
        return exportData;
    };
}

function convertToCSV(data) {
    let csv = 'Type,Value,Unit\n';
    
    data.distances.forEach((d, i) => {
        csv += `Distance ${i+1},${d.toFixed(2)},${data.scaleFactor ? 'meters' : 'units'}\n`;
    });
    
    data.areas.forEach((a, i) => {
        csv += `Area ${i+1},${a.toFixed(2)},${data.scaleFactor ? 'square meters' : 'square units'}\n`;
    });
    
    return csv;
}