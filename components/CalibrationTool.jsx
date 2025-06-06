import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Form, ProgressBar, Alert } from 'react-bootstrap';
import { 
    startCalibration, 
    addCalibrationPoint, 
    calculateScaleFactor, 
    cancelCalibration 
} from '../actions/calibration';

const CalibrationTool = ({
    isCalibrating,
    calibrationStep,
    calibrationPoints,
    scaleFactor,
    calculatedDistance,
    onStartCalibration,
    onAddPoint,
    onCalculateScale,
    onCancelCalibration
}) => {
    const [showModal, setShowModal] = useState(false);
    const [realDistance, setRealDistance] = useState(1);
    const [error, setError] = useState(null);

    const handleAddPoint = () => {
        if (calibrationStep === 5) {
            onCalculateScale();
            setShowModal(true);
        } else {
            onAddPoint();
        }
    };

    const handleStart = () => {
        if (realDistance <= 0) {
            setError('Distance must be greater than zero');
            return;
        }
        setError(null);
        onStartCalibration(realDistance);
    };

    const getInstruction = () => {
        switch (calibrationStep) {
            case 1: return 'Mark first point in Image 1';
            case 2: return 'Mark second point in Image 1';
            case 3: return 'Mark first point in Image 2';
            case 4: return 'Mark second point in Image 2';
            case 5: return 'Calculate scale factor';
            default: return '';
        }
    };

    return (
        <div className="calibration-tool" style={{ 
            position: 'absolute', 
            top: '10px', 
            right: '10px', 
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '10px',
            borderRadius: '4px',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)'
        }}>
            {!isCalibrating ? (
                <div>
                    <Form.Group>
                        <Form.Label>Known distance (meters):</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={realDistance}
                            onChange={(e) => setRealDistance(parseFloat(e.target.value) || 1)}
                        />
                    </Form.Group>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Button 
                        variant="warning" 
                        onClick={handleStart}
                        block
                    >
                        Start Calibration
                    </Button>
                </div>
            ) : (
                <div>
                    <h5>Calibration Progress</h5>
                    <p>{getInstruction()} ({calibrationStep}/5)</p>
                    <ProgressBar now={(calibrationStep / 5) * 100} className="mb-3" />
                    
                    <Button 
                        variant="primary" 
                        onClick={handleAddPoint}
                        disabled={calibrationStep > 5}
                        block
                        className="mb-2"
                    >
                        {calibrationStep < 5 ? `Mark Point ${calibrationStep}` : 'Calculate Scale'}
                    </Button>
                    
                    <Button 
                        variant="danger" 
                        onClick={onCancelCalibration}
                        block
                    >
                        Cancel Calibration
                    </Button>
                </div>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Calibration Results</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Known distance between points (meters):</Form.Label>
                        <Form.Control 
                            type="number" 
                            step="0.01"
                            min="0.01"
                            value={realDistance}
                            onChange={(e) => setRealDistance(parseFloat(e.target.value) || 1)}
                        />
                    </Form.Group>

                    <div className="mt-3">
                        <h5>Results</h5>
                        <p>Pixel distance: {calculatedDistance.toFixed(4)}</p>
                        <p>Scale factor: <strong>1px = {(realDistance / calculatedDistance).toFixed(4)} meters</strong></p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

const mapStateToProps = state => ({
    isCalibrating: state.calibration?.isCalibrating,
    calibrationStep: state.calibration?.step,
    calibrationPoints: state.calibration?.points,
    scaleFactor: state.calibration?.scaleFactor,
    calculatedDistance: state.calibration?.calculatedDistance
});

const mapDispatchToProps = {
    onStartCalibration: startCalibration,
    onAddPoint: addCalibrationPoint,
    onCalculateScale: calculateScaleFactor,
    onCancelCalibration: cancelCalibration
};

export default connect(mapStateToProps, mapDispatchToProps)(CalibrationTool);