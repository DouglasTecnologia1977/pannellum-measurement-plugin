import { Observable } from 'rxjs';
import { 
    START_DISTANCE_MEASUREMENT, 
    START_AREA_MEASUREMENT,
    ADD_MEASUREMENT_POINT,
    EXPORT_MEASUREMENTS
} from '../actions/measurement';
import { 
    START_CALIBRATION,
    ADD_CALIBRATION_POINT,
    CALCULATE_SCALE_FACTOR
} from '../actions/calibration';

// Epic para lidar com mudanças no modo de medição
const handleMeasurementMode = (action$, store) =>
    action$.ofType(START_DISTANCE_MEASUREMENT, START_AREA_MEASUREMENT)
        .switchMap(action => {
            // Aqui você pode adicionar lógica adicional quando o modo de medição muda
            return Observable.empty();
        });

// Epic para lidar com pontos de medição
const handleMeasurementPoints = (action$, store) =>
    action$.ofType(ADD_MEASUREMENT_POINT)
        .filter(() => !!store.getState().measurement.mode)
        .switchMap(action => {
            // Lógica adicional quando um ponto de medição é adicionado
            return Observable.empty();
        });

// Epic para lidar com calibração
const handleCalibration = (action$, store) =>
    action$.ofType(START_CALIBRATION, ADD_CALIBRATION_POINT, CALCULATE_SCALE_FACTOR)
        .switchMap(action => {
            // Lógica adicional para o processo de calibração
            return Observable.empty();
        });

// Epic para exportação de dados
const handleExport = (action$, store) =>
    action$.ofType(EXPORT_MEASUREMENTS)
        .switchMap(action => {
            // Lógica adicional para exportação
            return Observable.empty();
        });

export default [
    handleMeasurementMode,
    handleMeasurementPoints,
    handleCalibration,
    handleExport
];