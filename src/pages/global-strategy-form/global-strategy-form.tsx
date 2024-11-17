import React, { useState } from 'react';
import './global-strategy-form.css'

const TicketIcon = () => (
    <svg
        viewBox="0 0 24 24"
        width="32"
        height="32"
        className="ticket-icon"
    >
        <path d="M22 10V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-2-1.46c-1.19.69-2 1.99-2 3.46s.81 2.77 2 3.46V18H4v-2.54c1.19-.69 2-1.99 2-3.46 0-1.48-.8-2.77-1.99-3.46L4 6h16v2.54z" />
    </svg>
);

const BackIcon = () => (
    <svg viewBox="0 0 24 24" width="32" height="32" className="back-icon">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
);

export const GlobalStrategyForm: React.FC = () => {
    const [settings, setSettings] = useState({
        mapWidth: '10',
        mapHeight: '60',
        desks: '4',
        entrances: '3',
        minServiceTime: '4',
        maxServiceTime: '3',
        maxClients: '2000'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log('Saving settings:', settings);
        // Add your save logic here
    };

    const handleBack = () => {
        console.log('Navigating back');
        // Add your navigation logic here
    };

    return (
        <div className="settings-container">
            <button className="back-button" onClick={handleBack}>
                <BackIcon />
            </button>

            <div className="settings-content">
                <div className="settings-left">
                    <div className="setting-group">
                        <h2 className="setting-label">MAP SIZE</h2>
                        <div className="map-size-inputs">
                            <input
                                type="text"
                                name="mapWidth"
                                value={settings.mapWidth}
                                onChange={handleChange}
                                className="setting-input"
                            />
                            <span className="multiply">×</span>
                            <input
                                type="text"
                                name="mapHeight"
                                value={settings.mapHeight}
                                onChange={handleChange}
                                className="setting-input"
                            />
                        </div>
                    </div>

                    <div className="setting-group">
                        <div className="setting-group-inner">
                            <div className="setting-group-item">
                                <h2 className="setting-label">DESKS</h2>
                                <input
                                    type="text"
                                    name="desks"
                                    value={settings.desks}
                                    onChange={handleChange}
                                    className="setting-input"
                                />
                            </div>
                            <div className="setting-group-item">
                                <h2 className="setting-label">ENTRANCES</h2>
                                <input
                                    type="text"
                                    name="entrances"
                                    value={settings.entrances}
                                    onChange={handleChange}
                                    className="setting-input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="setting-group">
                        <h2 className="setting-label">SERVICE TIME</h2>
                        <div className="setting-group-inner">
                            <div className='setting-group-item'>
                                <span className="time-label">MIN</span>
                                <input
                                    type="text"
                                    name="minServiceTime"
                                    value={settings.minServiceTime}
                                    onChange={handleChange}
                                    className="setting-input"
                                />
                            </div>
                            <div className='setting-group-item'>
                                <span className="time-label">MAX</span>
                                <input
                                    type="text"
                                    name="maxServiceTime"
                                    value={settings.maxServiceTime}
                                    onChange={handleChange}
                                    className="setting-input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="setting-group setting-group-max-number-clients">
                        <h2 className="setting-label">MAX NUMBER OF CLIENTS</h2>
                        <div className="setting-group-item">
                            <input
                                type="text"
                                name="maxClients"
                                value={settings.maxClients}
                                onChange={handleChange}
                                className="setting-input"
                            />
                        </div>
                    </div>
                </div>

                <div className="settings-right">
                    <div className="title-section">
                        <div className="icon-container">
                            <TicketIcon />
                        </div>
                        <h1 className="title">TICKETS SIMULATOR</h1>
                        <p className="subtitle">SETTINGS</p>
                    </div>

                    <div className="strategy-section">
                        <h2 className="strategy-title">GLOBAL</h2>
                        <h2 className="strategy-title accent">STRATEGY</h2>
                    </div>

                    <button className="save-button" onClick={handleSave}>
                        SAVE
                    </button>
                </div>
            </div>
        </div>
    );
};