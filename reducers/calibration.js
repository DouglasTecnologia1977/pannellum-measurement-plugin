import {
    START_CALIBRATION,
    ADD_CALIBRATION_POINT,
    FINISH_CALIBRATION,
    CANCEL_CALIBRATION,
    CALCULATE_SCALE_FACTOR
} from '../actions/calibration';

const initialState = {
    isCalibrating: false,
    step: 0,
    points: [],
    referencePoints: [],
    scaleFactor: null,
    realDistance: 1,
    calculatedDistance: 0,
    error: null
};

function calculateDistanceBetweenPoints(point1, point2) {
    // Converter coordenadas angulares para radianos
    const φ1 = (point1.pitch * Math.PI) / 180;
    const λ1 = (point1.yaw * Math.PI) / 180;
    const φ2 = (point2.pitch * Math.PI) / 180;
    const λ2 = (point2.yaw * Math.PI) / 180;
    
    // Fórmula de Haversine para distância esférica
    const Δφ = φ2 - φ1;
    const Δλ = λ2 - λ1;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return c;
}

export default function calibrationReducer(state = initialState, action) {
    switch (action.type) {
        case START_CALIBRATION:
            return {
                ...initialState,
                isCalibrating: true,
                step: 1,
                realDistance: action.realDistance || 1
            };
            
        case ADD_CALIBRATION_POINT:
            const newPoints = [...state.points, action.point];
            const newStep = state.step + 1;
            let newReferencePoints = [...state.referencePoints];
            
            // Se for o primeiro ponto da segunda imagem, armazena os pontos de referência
            if (newStep === 3) {
                newReferencePoints = [...state.points];
            }
            
            return {
                ...state,
                points: newPoints,
                referencePoints: newReferencePoints,
                step: newStep,
                error: null
            };
            
        case CALCULATE_SCALE_FACTOR:
            if (state.points.length < 4) return state;
            
            // Calcula distância entre os pontos correspondentes nas duas imagens
            const distanceImg1 = calculateDistanceBetweenPoints(state.referencePoints[0], state.referencePoints[1]);
            const distanceImg2 = calculateDistanceBetweenPoints(state.points[2], state.points[3]);
            const avgDistance = (distanceImg1 + distanceImg2) / 2;
            
            // Calcula o fator de escala (distância real / distância calculada)
            const scaleFactor = state.realDistance / avgDistance;
            
            return {
                ...state,
                calculatedDistance: avgDistance,
                scaleFactor,
                isCalibrating: false
            };
            
        case FINISH_CALIBRATION:
            return {
                ...state,
                isCalibrating: false
            };
            
        case CANCEL_CALIBRATION:
            return initialState;
            
        default:
            return state;
    }
}