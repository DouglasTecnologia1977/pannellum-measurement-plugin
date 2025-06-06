export const START_CALIBRATION = 'CALIBRATION/START';
export const ADD_CALIBRATION_POINT = 'CALIBRATION/ADD_POINT';
export const FINISH_CALIBRATION = 'CALIBRATION/FINISH';
export const CANCEL_CALIBRATION = 'CALIBRATION/CANCEL';
export const CALCULATE_SCALE_FACTOR = 'CALIBRATION/CALCULATE_SCALE';

export function startCalibration(realDistance = 1) {
    return {
        type: START_CALIBRATION,
        realDistance
    };
}

export function addCalibrationPoint(point) {
    return {
        type: ADD_CALIBRATION_POINT,
        point
    };
}

export function calculateScaleFactor() {
    return (dispatch, getState) => {
        const { points, referencePoints } = getState().calibration;
        
        if (points.length < 4 || referencePoints.length < 2) {
            return;
        }
        
        dispatch({
            type: CALCULATE_SCALE_FACTOR
        });
        
        dispatch(finishCalibration());
    };
}

export function finishCalibration() {
    return {
        type: FINISH_CALIBRATION
    };
}

export function cancelCalibration() {
    return {
        type: CANCEL_CALIBRATION
    };
}