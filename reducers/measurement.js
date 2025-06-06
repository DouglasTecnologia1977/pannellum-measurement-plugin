import { 
    START_DISTANCE_MEASUREMENT,
    START_AREA_MEASUREMENT,
    ADD_MEASUREMENT_POINT,
    CLEAR_MEASUREMENTS,
    SAVE_MEASUREMENTS,
    LOAD_MEASUREMENTS
} from '../actions/measurement';

const initialState = {
    mode: null, // 'distance' or 'area'
    points: [],
    distances: [],
    areas: [],
    lastSaved: null,
    version: '1.0'
};

function calculateSphericalDistance(point1, point2) {
    // Convert degrees to radians
    const φ1 = point1.pitch * Math.PI / 180;
    const λ1 = point1.yaw * Math.PI / 180;
    const φ2 = point2.pitch * Math.PI / 180;
    const λ2 = point2.yaw * Math.PI / 180;

    // Haversine formula
    const Δφ = φ2 - φ1;
    const Δλ = λ2 - λ1;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    
    return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function calculateSphericalArea(points) {
    if (points.length < 3) return 0;
    
    // Convert points to vectors
    const vectors = points.map(p => {
        const φ = p.pitch * Math.PI / 180;
        const λ = p.yaw * Math.PI / 180;
        return {
            x: Math.cos(φ) * Math.cos(λ),
            y: Math.cos(φ) * Math.sin(λ),
            z: Math.sin(φ)
        };
    });

    // Calculate area using Girard's theorem
    let area = (points.length - 2) * Math.PI;
    
    for (let i = 0; i < vectors.length; i++) {
        const j = (i + 1) % vectors.length;
        const k = (i + 2) % vectors.length;
        
        // Cross products
        const v1 = {
            x: vectors[i].y * vectors[j].z - vectors[i].z * vectors[j].y,
            y: vectors[i].z * vectors[j].x - vectors[i].x * vectors[j].z,
            z: vectors[i].x * vectors[j].y - vectors[i].y * vectors[j].x
        };
        
        const v2 = {
            x: vectors[i].y * vectors[k].z - vectors[i].z * vectors[k].y,
            y: vectors[i].z * vectors[k].x - vectors[i].x * vectors[k].z,
            z: vectors[i].x * vectors[k].y - vectors[i].y * vectors[k].x
        };
        
        // Angle between planes
        const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
        const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
        const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
        const angle = Math.acos(dot / (mag1 * mag2));
        
        area -= angle;
    }
    
    return Math.abs(area);
}

export default function measurementReducer(state = initialState, action) {
    switch (action.type) {
        case START_DISTANCE_MEASUREMENT:
            return {
                ...initialState,
                mode: 'distance'
            };
            
        case START_AREA_MEASUREMENT:
            return {
                ...initialState,
                mode: 'area'
            };
            
        case ADD_MEASUREMENT_POINT:
            const newPoints = [...state.points, action.point];
            
            // Calculate distances or areas based on mode
            if (state.mode === 'distance' && newPoints.length >= 2) {
                const lastTwoPoints = newPoints.slice(-2);
                const distance = calculateSphericalDistance(...lastTwoPoints);
                return {
                    ...state,
                    points: newPoints,
                    distances: [...state.distances, distance]
                };
            }
            
            if (state.mode === 'area' && newPoints.length >= 3) {
                const area = calculateSphericalArea(newPoints);
                return {
                    ...state,
                    points: newPoints,
                    areas: [area] // Only keep the latest area measurement
                };
            }
            
            return {
                ...state,
                points: newPoints
            };
            
        case CLEAR_MEASUREMENTS:
            return initialState;
            
        case SAVE_MEASUREMENTS:
            try {
                localStorage.setItem('pannellumMeasurements', JSON.stringify({
                    ...state,
                    lastSaved: new Date().toISOString()
                }));
            } catch (e) {
                console.error('Failed to save measurements:', e);
            }
            return state;
            
        case LOAD_MEASUREMENTS:
            try {
                const savedData = JSON.parse(localStorage.getItem('pannellumMeasurements'));
                if (savedData && savedData.version === '1.0') {
                    return {
                        ...savedData,
                        mode: null // Reset mode when loading
                    };
                }
            } catch (e) {
                console.error('Failed to load measurements:', e);
            }
            return state;
            
        default:
            return state;
    }
}