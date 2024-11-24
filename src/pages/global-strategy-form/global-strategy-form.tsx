import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './global-strategy-form.css'
import Image4 from '../../assets/train-ticket.png'

const BackIcon = () => (
    <svg viewBox="0 0 24 24" width="32" height="32" className="back-icon">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
);

type FieldName = 'mapWidth' | 'mapHeight' | 'desks' | 'entrances' | 
    'minServiceTime' | 'maxServiceTime' | 'maxClientNumber';

type FormErrors = Partial<Record<FieldName, string>>;

export const GlobalStrategyForm: React.FC = () => {
    const navigate = useNavigate();

    const [settings, setSettings] = useState({
        mapWidth: '10',
        mapHeight: '10',
        desks: '5',
        entrances: '2',
        minServiceTime: '4000',
        maxServiceTime: '5000',
        maxClientNumber: '10'
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<FieldName, boolean>>({
        mapWidth: false,
        mapHeight: false,
        desks: false,
        entrances: false,
        minServiceTime: false,
        maxServiceTime: false,
        maxClientNumber: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateField = (name: FieldName, value: string, allSettings = settings): string => {
        const numberValue = Number(value);
        const mapSide = Number(allSettings.mapWidth);
        
        switch (name) {
            case 'mapWidth': {
                if (!value.trim()) return 'Map width is required';
                if (isNaN(numberValue)) return 'Must be a number';
                if (numberValue < 5) return 'Minimum width is 5';
                if (numberValue > 100) return 'Maximum width is 100';
                if (numberValue !== Number(allSettings.mapHeight)) {
                    return 'Map must be square (width must equal height)';
                }
                break;
            }
            
            case 'mapHeight': {
                if (!value.trim()) return 'Map height is required';
                if (isNaN(numberValue)) return 'Must be a number';
                if (numberValue < 5) return 'Minimum height is 5';
                if (numberValue > 100) return 'Maximum height is 100';
                if (numberValue !== Number(allSettings.mapWidth)) {
                    return 'Map must be square (height must equal width)';
                }
                break;
            }
            
            case 'desks': {
                if (!value.trim()) return 'Number of desks is required';
                if (isNaN(numberValue)) return 'Must be a number';
                if (numberValue < 1) return 'Minimum 1 desk required';
                const maxDesks = Math.floor(mapSide / 2);
                if (numberValue > maxDesks) {
                    return `Maximum ${maxDesks} desks allowed (half of map side)`;
                }
                break;
            }
            
            case 'entrances': {
                if (!value.trim()) return 'Number of entrances is required';
                if (isNaN(numberValue)) return 'Must be a number';
                if (numberValue < 1) return 'Minimum 1 entrance required';
                const maxEntrances = Math.floor(mapSide / 2);
                if (numberValue > maxEntrances) {
                    return `Maximum ${maxEntrances} entrances allowed (half of map side)`;
                }
                break;
            }
            
            case 'minServiceTime': {
                if (!value.trim()) return 'Minimum service time is required';
                if (isNaN(numberValue)) return 'Must be a number';
                if (numberValue < 1) return 'Minimum time is 1';
                if (numberValue >= Number(allSettings.maxServiceTime)) {
                    return 'Must be less than max service time';
                }
                break;
            }
            
            case 'maxServiceTime': {
                if (!value.trim()) return 'Maximum service time is required';
                if (isNaN(numberValue)) return 'Must be a number';
                if (numberValue <= Number(allSettings.minServiceTime)) {
                    return 'Must be greater than min service time';
                }
                break;
            }
            
            case 'maxClientNumber': {
                if (!value.trim()) return 'Maximum clients is required';
                if (isNaN(numberValue)) return 'Must be a number';
                if (numberValue < 1) return 'Minimum 1 client required';
                if (numberValue > 10000) return 'Maximum 10000 clients allowed';
                break;
            }
        }
        return '';
    };

    const validateForm = (currentSettings = settings) => {
        const newErrors: FormErrors = {};
        (Object.keys(currentSettings) as FieldName[]).forEach(key => {
            const error = validateField(key, currentSettings[key], currentSettings);
            if (error) newErrors[key] = error;
        });
        return {
            errors: newErrors,
            isValid: Object.keys(newErrors).length === 0
        };
    };

    const [isFormValid, setIsFormValid] = useState(true);

    useEffect(() => {
        const { isValid } = validateForm();
        setIsFormValid(isValid);
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let updatedSettings = { ...settings, [name]: value };
        
        // If changing width or height, ensure square map
        if (name === 'mapWidth') {
            updatedSettings = { ...updatedSettings, mapHeight: value };
        } else if (name === 'mapHeight') {
            updatedSettings = { ...updatedSettings, mapWidth: value };
        }
        
        // Validate all dependent fields when map size changes
        const { errors: newErrors } = validateForm(updatedSettings);
        
        setSettings(updatedSettings);
        setErrors(newErrors);
        setIsFormValid(Object.keys(newErrors).length === 0);
        
        // Mark changed field as touched
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        
        // Revalidate on blur to ensure all dependent validations are current
        const { errors: newErrors } = validateForm();
        setErrors(newErrors);
    };
    
    const handleSave = async () => {
        setIsSubmitting(true);
        const { errors: formErrors, isValid } = validateForm();

        if (isValid) {
            const deskCount = Number(settings.desks);
            const entranceCount = Number(settings.entrances);
            const requestBody = {
                deskPositions: Array.from({ length: deskCount }, (_, i) => ({ x: i, y: 0 })),
                entrancePositions: Array.from({ length: entranceCount }, (_, i) => ({ x: 0, y: i })),
                reserveDeskPosition: { x: 0, y: 0 }, 
                minServiceTime: Number(settings.minServiceTime),
                maxServiceTime: Number(settings.maxServiceTime),
                clientGenerator: { generatorType: "default" },
                maxClientNumber: Number(settings.maxClientNumber),
                stationWidth: Number(settings.mapWidth),
                stationHeight: Number(settings.mapHeight),
            };

            navigate("/choose-strategy-page", {
                state: {
                    settings
                }
            });
        } else {
            setErrors(formErrors);
            const allTouched = Object.keys(touched).reduce(
                (acc, key) => ({ ...acc, [key]: true }),
                {}
            );
            setTouched(allTouched as Record<FieldName, boolean>);
        }
        setIsSubmitting(false);
    };

    const handleBack = () => {
        navigate("/");
    };

    const shouldShowError = (fieldName: FieldName): boolean => {
        return Boolean(touched[fieldName] && errors[fieldName]);
    };

    const getInputStyle = (fieldName: FieldName): string => {
        return `setting-input ${shouldShowError(fieldName) ? 'error' : ''}`;
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
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    name="mapWidth"
                                    value={settings.mapWidth}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={getInputStyle('mapWidth')}
                                    aria-invalid={shouldShowError('mapWidth')}
                                />
                                {shouldShowError('mapWidth') && 
                                    <div className="error-message">{errors.mapWidth}</div>
                                }
                            </div>
                            <span className="multiply">×</span>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    name="mapHeight"
                                    value={settings.mapHeight}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={getInputStyle('mapHeight')}
                                    aria-invalid={shouldShowError('mapHeight')}
                                />
                                {shouldShowError('mapHeight') && 
                                    <div className="error-message">{errors.mapHeight}</div>
                                }
                            </div>
                        </div>
                    </div>

                    {/* Rest of the JSX remains the same... */}
                    <div className="setting-group">
                        <div className="setting-group-inner">
                            <div className="setting-group-item">
                                <h2 className="setting-label">DESKS</h2>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        name="desks"
                                        value={settings.desks}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={getInputStyle('desks')}
                                        aria-invalid={shouldShowError('desks')}
                                    />
                                    {shouldShowError('desks') && 
                                        <div className="error-message">{errors.desks}</div>
                                    }
                                </div>
                            </div>
                            <div className="setting-group-item">
                                <h2 className="setting-label">ENTRANCES</h2>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        name="entrances"
                                        value={settings.entrances}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={getInputStyle('entrances')}
                                        aria-invalid={shouldShowError('entrances')}
                                    />
                                    {shouldShowError('entrances') && 
                                        <div className="error-message">{errors.entrances}</div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="setting-group">
                        <h2 className="setting-label">SERVICE TIME</h2>
                        <div className="setting-group-inner">
                            <div className='setting-group-item'>
                                <span className="time-label">MIN</span>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        name="minServiceTime"
                                        value={settings.minServiceTime}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={getInputStyle('minServiceTime')}
                                        aria-invalid={shouldShowError('minServiceTime')}
                                    />
                                    {shouldShowError('minServiceTime') && 
                                        <div className="error-message">{errors.minServiceTime}</div>
                                    }
                                </div>
                            </div>
                            <div className='setting-group-item'>
                                <span className="time-label">MAX</span>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        name="maxServiceTime"
                                        value={settings.maxServiceTime}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={getInputStyle('maxServiceTime')}
                                        aria-invalid={shouldShowError('maxServiceTime')}
                                    />
                                    {shouldShowError('maxServiceTime') && 
                                        <div className="error-message">{errors.maxServiceTime}</div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="setting-group setting-group-max-number-clients">
                        <h2 className="setting-label">MAX NUMBER OF CLIENTS</h2>
                        <div className="setting-group-item">
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    name="maxClientNumber"
                                    value={settings.maxClientNumber}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={getInputStyle('maxClientNumber')}
                                    aria-invalid={shouldShowError('maxClientNumber')}
                                />
                                {shouldShowError('maxClientNumber') && 
                                    <div className="error-message">{errors.maxClientNumber}</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glb-half-circle">
                    <div className="circle-content">
                        <img className='choose-title' src={Image4} alt="Ticket" />
                        <h1 className="choose-title">TICKETS SIMULATOR</h1>
                        <p className="csp-subtitle">SETTINGS</p>
                        <h2 className="csp-global-title">
                            GLOBAL <br />
                            <p className="strategy-highlight">STRATEGY</p>
                        </h2>
                    </div>
                    <button 
                        className="csp-save-button" 
                        onClick={handleSave}
                        disabled={isSubmitting || !isFormValid}>
                        {isSubmitting ? 'SAVING...' : 'SAVE'}
                    </button>
                </div>
            </div>
        </div>
    );
};