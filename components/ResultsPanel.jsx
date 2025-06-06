import React from 'react';
import { connect } from 'react-redux';
import { Table, Badge } from 'react-bootstrap';

const ResultsPanel = ({ distances, areas, scaleFactor }) => {
    return (
        <div className="results-panel" style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '10px',
            borderRadius: '4px',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
            maxWidth: '300px'
        }}>
            <h5>Measurement Results</h5>
            
            {distances.length > 0 && (
                <div className="mb-3">
                    <h6>Distances <Badge variant="primary">{distances.length}</Badge></h6>
                    <Table striped bordered size="sm">
                        <thead>
                            <tr>
                                <th>Segment</th>
                                <th>Distance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {distances.map((distance, index) => (
                                <tr key={`distance-${index}`}>
                                    <td>{index + 1}</td>
                                    <td>{(distance * (scaleFactor || 1)).toFixed(2)} {scaleFactor ? 'm' : 'units'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            {areas.length > 0 && (
                <div>
                    <h6>Areas <Badge variant="primary">{areas.length}</Badge></h6>
                    <Table striped bordered size="sm">
                        <thead>
                            <tr>
                                <th>Area</th>
                                <th>Size</th>
                            </tr>
                        </thead>
                        <tbody>
                            {areas.map((area, index) => (
                                <tr key={`area-${index}`}>
                                    <td>{index + 1}</td>
                                    <td>{(area * (scaleFactor || 1)).toFixed(2)} {scaleFactor ? 'm²' : 'units²'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            {distances.length === 0 && areas.length === 0 && (
                <p className="text-muted">No measurements yet</p>
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    distances: state.measurement?.distances || [],
    areas: state.measurement?.areas || [],
    scaleFactor: state.calibration?.scaleFactor
});

export default connect(mapStateToProps)(ResultsPanel);