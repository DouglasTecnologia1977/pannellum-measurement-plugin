import React from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { 
    startDistanceMeasurement, 
    startAreaMeasurement, 
    clearMeasurements,
    saveMeasurements,
    loadMeasurements
} from '../actions/measurement';
import { FaRuler, FaDrawPolygon, FaEraser, FaSave, FaFolderOpen } from 'react-icons/fa';

const MeasurementControls = ({
    onDistanceMeasure,
    onAreaMeasure,
    onClearMeasurements,
    onSaveMeasurements,
    onLoadMeasurements,
    isMeasuring,
    distances,
    areas,
    scaleFactor
}) => {
    const distanceTooltip = (
        <Tooltip id="distance-tooltip">
            <h6>Distance Measurements</h6>
            {distances.length > 0 ? (
                <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
                    {distances.map((d, i) => (
                        <li key={i}>
                            Segment {i+1}: <strong>{(d * (scaleFactor || 1)).toFixed(2)} {scaleFactor ? 'm' : 'units'}</strong>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No distance measurements</p>
            )}
        </Tooltip>
    );

    const areaTooltip = (
        <Tooltip id="area-tooltip">
            <h6>Area Measurements</h6>
            {areas.length > 0 ? (
                <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
                    {areas.map((a, i) => (
                        <li key={i}>
                            Area {i+1}: <strong>{(a * (scaleFactor || 1)).toFixed(2)} {scaleFactor ? 'm²' : 'units²'}</strong>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No area measurements</p>
            )}
        </Tooltip>
    );

    return (
        <div className="measurement-controls">
            <ButtonGroup vertical>
                <OverlayTrigger placement="right" overlay={distanceTooltip}>
                    <Button 
                        variant={isMeasuring === 'distance' ? 'success' : 'primary'} 
                        onClick={onDistanceMeasure}
                        disabled={isMeasuring === 'distance'}
                    >
                        <FaRuler className="mr-2" />
                        {isMeasuring === 'distance' ? 'Measuring...' : 'Measure Distance'}
                        {distances.length > 0 && (
                            <Badge pill variant="light" className="ml-2">
                                {distances.length}
                            </Badge>
                        )}
                    </Button>
                </OverlayTrigger>

                <OverlayTrigger placement="right" overlay={areaTooltip}>
                    <Button 
                        variant={isMeasuring === 'area' ? 'success' : 'primary'} 
                        onClick={onAreaMeasure}
                        disabled={isMeasuring === 'area'}
                    >
                        <FaDrawPolygon className="mr-2" />
                        {isMeasuring === 'area' ? 'Measuring...' : 'Measure Area'}
                        {areas.length > 0 && (
                            <Badge pill variant="light" className="ml-2">
                                {areas.length}
                            </Badge>
                        )}
                    </Button>
                </OverlayTrigger>

                <Button variant="secondary" onClick={onSaveMeasurements}>
                    <FaSave className="mr-2" />
                    Save Measurements
                </Button>

                <Button variant="secondary" onClick={onLoadMeasurements}>
                    <FaFolderOpen className="mr-2" />
                    Load Measurements
                </Button>

                <Button variant="danger" onClick={onClearMeasurements}>
                    <FaEraser className="mr-2" />
                    Clear All
                </Button>

                {scaleFactor && (
                    <div className="mt-2 p-2 bg-light rounded text-center">
                        <small>
                            <strong>Scale:</strong> 1px = {(scaleFactor).toFixed(4)} m<br />
                            <strong>Precision:</strong> ±{(scaleFactor * 2).toFixed(2)} m
                        </small>
                    </div>
                )}
            </ButtonGroup>
        </div>
    );
};

const mapStateToProps = state => ({
    isMeasuring: state.measurement?.mode,
    distances: state.measurement?.distances || [],
    areas: state.measurement?.areas || [],
    scaleFactor: state.calibration?.scaleFactor
});

const mapDispatchToProps = {
    onDistanceMeasure: startDistanceMeasurement,
    onAreaMeasure: startAreaMeasurement,
    onClearMeasurements: clearMeasurements,
    onSaveMeasurements: saveMeasurements,
    onLoadMeasurements: loadMeasurements
};

export default connect(mapStateToProps, mapDispatchToProps)(MeasurementControls);