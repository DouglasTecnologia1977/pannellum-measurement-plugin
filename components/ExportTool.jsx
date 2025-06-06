import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Form, Tabs, Tab, Alert } from 'react-bootstrap';
import { exportMeasurements } from '../actions/measurement';
import { saveAs } from 'file-saver';

const ExportTool = ({ measurements, scaleFactor, onExport }) => {
    const [showModal, setShowModal] = useState(false);
    const [exportFormat, setExportFormat] = useState('json');
    const [exportData, setExportData] = useState('');
    const [error, setError] = useState(null);

    const handleExport = async () => {
        if (!measurements.points || measurements.points.length === 0) {
            setError('No measurements to export');
            return;
        }
        
        setError(null);
        const data = await onExport(exportFormat);
        setExportData(data);
        setShowModal(true);
    };

    const handleDownload = () => {
        const blob = new Blob([exportData], { 
            type: exportFormat === 'json' ? 'application/json' : 'text/csv' 
        });
        saveAs(blob, `measurements-${new Date().toISOString().slice(0, 10)}.${exportFormat}`);
    };

    return (
        <>
            <Button 
                variant="info" 
                onClick={handleExport}
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 1000
                }}
            >
                Export Measurements
            </Button>

            {error && (
                <Alert variant="danger" style={{
                    position: 'absolute',
                    bottom: '70px',
                    right: '20px',
                    zIndex: 1000,
                    width: '300px'
                }}>
                    {error}
                </Alert>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Export Measurements</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Export Format:</Form.Label>
                        <Form.Control
                            as="select"
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value)}
                        >
                            <option value="json">JSON</option>
                            <option value="csv">CSV</option>
                            <option value="geojson">GeoJSON</option>
                        </Form.Control>
                    </Form.Group>

                    <Tabs defaultActiveKey="preview" className="mt-3">
                        <Tab eventKey="preview" title="Preview">
                            <pre style={{ 
                                maxHeight: '300px', 
                                overflow: 'auto',
                                backgroundColor: '#f5f5f5',
                                padding: '10px',
                                borderRadius: '4px'
                            }}>
                                {exportData}
                            </pre>
                        </Tab>
                        <Tab eventKey="actions" title="Actions">
                            <div className="mt-3">
                                <Button 
                                    variant="primary" 
                                    onClick={handleDownload}
                                    className="mr-2"
                                >
                                    Download File
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        navigator.clipboard.writeText(exportData);
                                    }}
                                >
                                    Copy to Clipboard
                                </Button>
                            </div>
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

const mapStateToProps = state => ({
    measurements: state.measurement,
    scaleFactor: state.calibration?.scaleFactor
});

const mapDispatchToProps = {
    onExport: exportMeasurements
};

export default connect(mapStateToProps, mapDispatchToProps)(ExportTool);