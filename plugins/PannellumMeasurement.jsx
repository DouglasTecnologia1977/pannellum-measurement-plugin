import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { toggleControl } from '@mapstore/framework/actions/controls';
import { Button } from 'react-bootstrap';
import PannellumViewer from '../components/PannellumViewer';
import MeasurementControls from '../components/MeasurementControls';
import CalibrationTool from '../components/CalibrationTool';
import ExportTool from '../components/ExportTool';
import ResultsPanel from '../components/ResultsPanel';

class PannellumMeasurement extends React.Component {
    static propTypes = {
        active: PropTypes.bool,
        onClose: PropTypes.func,
        measurementMode: PropTypes.string,
        panoramaUrl: PropTypes.string
    };

    static defaultProps = {
        active: false,
        onClose: () => {},
        measurementMode: null,
        panoramaUrl: null
    };

    render() {
        if (!this.props.active) return null;

        return (
            <div className="pannellum-measurement-plugin" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                zIndex: 10000,
                display: 'flex',
                flexDirection: 'column',
                padding: '20px'
            }}>
                <Button 
                    className="close-button" 
                    onClick={this.props.onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        zIndex: 10001,
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    ×
                </Button>

                <div style={{ flex: 1, position: 'relative' }}>
                    <PannellumViewer 
                        panoramaUrl={this.props.panoramaUrl}
                        measurementMode={this.props.measurementMode}
                    />
                </div>

                <MeasurementControls />
                <CalibrationTool />
                <ExportTool />
                <ResultsPanel />

                {this.props.measurementMode && (
                    <div className="measurement-instruction-overlay">
                        <div className="instruction-text">
                            {this.props.measurementMode === 'distance' 
                                ? 'Click to add points for distance measurement'
                                : 'Click to add points for area measurement'}
                            <br />
                            <small>Double click to finish</small>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const selector = createSelector([
    state => state.controls?.pannellumMeasurement?.enabled,
    state => state.measurement?.mode,
    state => state.pannellum?.panoramaUrl
], (active, measurementMode, panoramaUrl) => ({
    active,
    measurementMode,
    panoramaUrl
}));

const actions = {
    onClose: toggleControl.bind(null, 'pannellumMeasurement', null)
};

export default connect(selector, actions)(PannellumMeasurement);